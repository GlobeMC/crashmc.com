import { useCDN } from "../cdn"

export {
  VERSION,
  MCLA_GH_DB_PREFIX,
  readable,
  StackInfo,
  Stacktrace,
  JavaError,
  ReportDetails,
  HeadThread,
  AffectedLevel,
  DetailsItem,
  CrashReport,
  ErrorDesc,
  SolutionPossibility,
  ErrorResult,
  AsyncIterator,
  Solution,
  MCLAAPI,
  loadMCLA,
}

// const VERSION = "v0.4.13"
const VERSION = "dev"
const RESOURCES_BASE = "https://globemc.github.io/mcla"
const GO_WASM_EXEC_URL = useCDN(`${RESOURCES_BASE}/${VERSION}/wasm_exec.js`)
const MCLA_WASM_URL = useCDN(`${RESOURCES_BASE}/${VERSION}/mcla.wasm`)
const MCLA_GH_DB_PREFIX = useCDN(
  "https://raw.githubusercontent.com/kmcsr/mcla-db-dev/main",
)

type readable =
  | string
  | Uint8Array
  | ReadableStream
  | ReadableStreamDefaultReader

interface StackInfo {
  raw: string
  class: string
  method: string
}

type Stacktrace = StackInfo[]

interface JavaError {
  class: string
  message: string
  stacktrace: Stacktrace
  causedBy: JavaError
  // extra infos
  lineNo: number
}

type ReportDetails = Map<string, string[]>

interface HeadThread {
  thread: string
  stacktrace: Stacktrace
}

interface AffectedLevel {
  details: ReportDetails
  stacktrace: Stacktrace
}

interface DetailsItem {
  details: ReportDetails
}

interface CrashReport {
  description: string
  error: JavaError
  head: HeadThread
  affectedLevel: AffectedLevel
  others: Map<string, DetailsItem>
}

interface ErrorDesc {
  error: string
  message: string
  solutions: number[]
}

interface SolutionPossibility {
  errorDesc: ErrorDesc
  match: number
}

interface ErrorResult {
  error: JavaError
  matched: SolutionPossibility[]
}

interface AsyncIterator<T> {
  next(): Promise<{ done: boolean; value: T }>
}

interface Solution {
  tags: string[]
  description: string
  link_to: string
}

interface MCLAAPI {
  version: string
  release(): void
  parseCrashReport(log: readable): Promise<CrashReport>
  parseLogErrors(log: readable): Promise<JavaError[]>
  analyzeLogErrors(log: readable): Promise<ErrorResult[]>
  analyzeLogErrorsIter(log: readable): Promise<AsyncIterator<ErrorResult>>
}

class MCLAWorker implements MCLAAPI {
  private readonly worker: Worker
  private _version: string
  private pendings: Map<number, (res: any) => void>

  constructor(worker: Worker) {
    this.worker = worker
    worker.onmessage = (event) => this.onmsg(event)
    this.pendings = new Map()
  }

  get version(): string {
    return this._version
  }

  private ask(data: any): Promise<any> {
    var i = 0
    while (this.pendings.has(i)) {
      i++
    }
    const p = new Promise((resolve, reject) => {
      this.pendings.set(i, resolve)
    })
    this.worker.postMessage({
      ...data,
      _id: i,
    })
    return p
  }

  private onmsg(event) {
    console.log("onmsg:", event)
    const { data } = event
    const re = this.pendings.get(data._id)
    if (re) {
      this.pendings.delete(data._id)
      re(data)
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
      case "object":
        if (res === null) {
          return res
        }
        if (res instanceof Array) {
          let obj = new Array(res.length)
          for (let i = 0; i < res.length; i++) {
            obj[i] = this.unwrapObj(res[i])
          }
          return obj
        }
        if (res.__worker_function) {
          return async (...args): Promise<any> => {
            return (
              await this.ask({
                type: "callObj",
                ptr: res.ptr,
                args: args,
              })
            ).res
          }
        }
        let obj = new Object()
        for (let k of Reflect.ownKeys(res)) {
          obj[k] = this.unwrapObj(res[k])
        }
        return obj
    }
    throw new Error("Unexpected type of res: " + typeof res)
  }

  private async call(name: string, ...args): Promise<any> {
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

  parseCrashReport(log: readable): Promise<CrashReport> {
    return this.call("parseCrashReport", log)
  }

  parseLogErrors(log: readable): Promise<JavaError[]> {
    return this.call("parseLogErrors", log)
  }

  analyzeLogErrors(log: readable): Promise<ErrorResult[]> {
    return this.call("analyzeLogErrors", log)
  }

  analyzeLogErrorsIter(log: readable): Promise<AsyncIterator<ErrorResult>> {
    return this.call("analyzeLogErrorsIter", log)
  }

  static async createFromWorker(worker: Worker): Promise<MCLAWorker> {
    const w = new MCLAWorker(worker)
    await w.init()
    return w
  }
}

async function loadMCLAWorker(): Promise<MCLAAPI> {
  return MCLAWorker.createFromWorker(
    new Worker("/src/mcla_worker.js", {
      type: "classic",
    }),
  )
}

interface containsGoCls {
  Go: any
}

interface containsMCLAIns {
  MCLA: MCLAAPI
}

async function loadMCLA(): Promise<MCLAAPI> {
  if (window.Worker) {
    return loadMCLAWorker()
  }

  await import(GO_WASM_EXEC_URL /* @vite-ignore */) // set variable `window.Go`

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
  function waitMCLA(): Promise<void> {
    if ((window as any as containsMCLAIns).MCLA) {
      return
    }
    return new Promise((re) => setTimeout(re, 10)) // sleep 10ms
      .then(waitMCLA)
  }
  await waitMCLA()
  return (window as any as containsMCLAIns).MCLA
}
