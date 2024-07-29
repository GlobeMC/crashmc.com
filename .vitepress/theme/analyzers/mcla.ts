import type { Ref } from "vue"
import { useCDN } from "@/theme/utils/cdn"

export { VERSION, MCLA_GH_DB_PREFIX, loadMCLA }

import type {
	readable,
	CrashReport,
	JavaError,
	ErrorResult,
	MCLAAPI,
} from "./mcla.api"
export * from "./mcla.api"

const VERSION = "v0.5.1"
// const VERSION = "dev"
const RESOURCES_BASE = "https://globemc.github.io/mcla"
const GO_WASM_EXEC_URL = useCDN(`${RESOURCES_BASE}/${VERSION}/wasm_exec.js`)
const MCLA_WASM_URL = useCDN(`${RESOURCES_BASE}/${VERSION}/mcla.wasm`)
const MCLA_GH_DB_PREFIX = useCDN(
	"https://raw.githubusercontent.com/kmcsr/mcla-db-dev/main",
)

type promiseSolver = (res: any) => void

class MCLAWorker implements MCLAAPI {
	private readonly worker: Worker
	private _version?: string
	private pendings: Map<number, promiseSolver[]>
	private readonly registry: FinalizationRegistry<number>
	private loadProgressWatcher?: (percent: number) => void

	constructor(worker: Worker) {
		this.worker = worker
		worker.onmessage = (event) => this.onmsg(event)
		worker.onerror = (event) => {
			console.error("Error in MCLA Worker:", event)
			for (const [, reject] of this.pendings.values()) {
				reject("Error inside MCLAWorker")
			}
			this.pendings.clear()
		}
		this.pendings = new Map()
		this.registry = new FinalizationRegistry((ptr: number) => {
			this.worker.postMessage({
				type: "releaseObj",
				ptr: ptr,
			})
		})
	}

	get version(): string {
		return this._version || ""
	}

	private ask(data: any): Promise<any> {
		var i = 0
		while (this.pendings.has(i)) {
			i++
		}
		const p = new Promise((resolve, reject) => {
			this.pendings.set(i, [resolve, reject])
		})
		this.worker.postMessage({
			...data,
			__id: i,
		})
		return p
	}

	private onmsg(event: MessageEvent) {
		const { data } = event
		switch (data.type) {
			case "reply": {
				const re = this.pendings.get(data.id)
				if (re) {
					this.pendings.delete(data.id)
					if (data.error) {
						re[1](data.error)
					} else {
						re[0](data)
					}
				}
				break
			}
			case "load-progress": {
				if (this.loadProgressWatcher) {
					this.loadProgressWatcher(data.percent as number)
				}
			}
		}
	}

	protected async init(): Promise<void> {
		const res = await this.ask({
			type: "setup",
			wasm_exec: GO_WASM_EXEC_URL,
			wasm_url: MCLA_WASM_URL,
		})
		this._version = res.version
	}

	private unwrapObj(res: any): any {
		switch (typeof res) {
			case "boolean":
			case "number":
			case "string":
			case "undefined":
				return res
			case "object": {
				if (res === null) {
					return res
				}
				if (res instanceof Array) {
					const obj = new Array(res.length)
					for (let i = 0; i < res.length; i++) {
						obj[i] = this.unwrapObj(res[i])
					}
					return obj
				}
				if (res.__worker_function) {
					const fn = async (...args: any[]): Promise<any> => {
						return (
							await this.ask({
								type: "callObj",
								ptr: res.ptr,
								args: args,
							})
						).res
					}
					this.registry.register(fn, res.ptr)
					return fn
				}
				const obj: { [key: string | symbol]: any } = {}
				for (const k of Reflect.ownKeys(res)) {
					obj[k] = this.unwrapObj(res[k])
				}
				return obj
			}
		}
		throw new Error("Unexpected type of res: " + typeof res)
	}

	private async call(name: string, ...args: any[]): Promise<any> {
		return this.unwrapObj(
			(
				await this.ask({
					type: "call",
					name: name,
					args: args,
				})
			).res,
		)
	}

	release() {
		this.call("release")
	}

	private watchLoadProgress(loadProgress: Ref<number>): void {
		this.loadProgressWatcher = (percent: number) => {
			loadProgress.value = percent
		}
	}

	parseCrashReport(log: readable): Promise<CrashReport> {
		return this.call("parseCrashReport", log)
	}

	parseLogErrors(log: readable): Promise<JavaError[]> {
		return this.call("parseLogErrors", log)
	}

	analyzeLogErrors(log: readable): Promise<ErrorResult[]> {
		return this.call("analyzeLogErrors", log)
	}

	async analyzeLogErrorsIter(
		log: readable,
	): Promise<AsyncIterable<ErrorResult>> {
		const iterator = await this.call("analyzeLogErrorsIter", log)
		iterator[Symbol.asyncIterator] = () => iterator
		return iterator
	}

	static async createFromWorker(
		worker: Worker,
		loadProgress?: Ref<number>,
	): Promise<MCLAWorker> {
		const w = new MCLAWorker(worker)
		console.log("Loading MCLA in worker ...")
		if (loadProgress) {
			w.watchLoadProgress(loadProgress)
		}
		await w.init()
		return w
	}
}

async function loadMCLAWorker(loadProgress?: Ref<number>): Promise<MCLAAPI> {
	const worker = MCLAWorker.createFromWorker(
		new Worker(new URL("@/workers/mcla.worker.ts", import.meta.url), {
			type: "classic",
		}),
		loadProgress,
	)
	return worker
}

interface containsGoCls {
	Go: any
}

interface containsMCLAIns {
	MCLA: MCLAAPI | undefined
}

async function loadMCLA(loadProgress?: Ref<number>): Promise<MCLAAPI> {
	if (window.Worker) {
		try {
			return loadMCLAWorker(loadProgress)
		} catch (e) {
			// if cannot load by worker, try load inside the window
		}
	}

	console.log("Loading MCLA ...")

	await import(/* @vite-ignore */ GO_WASM_EXEC_URL) // set variable `window.Go`

	const go = new (window as any as containsGoCls).Go()
	var res
	if (WebAssembly.instantiateStreaming) {
		res = await WebAssembly.instantiateStreaming(
			fetch(MCLA_WASM_URL),
			go.importObject,
		)
	} else {
		res = await fetch(MCLA_WASM_URL)
			.then((res) => res.arrayBuffer())
			.then((bts) => WebAssembly.instantiate(bts, go.importObject))
	}
	go.run(res.instance)
	// the global variable MCLA cannot be defined instantly, so we have to poll it
	const waitMCLA = (): MCLAAPI | Promise<MCLAAPI> => {
		return (
			(window as any as containsMCLAIns).MCLA ||
			new Promise((re) => setTimeout(re, 10)).then(waitMCLA)
		)
	}
	return await waitMCLA()
}
