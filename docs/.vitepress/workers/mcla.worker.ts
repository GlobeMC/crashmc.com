import type { MCLAAPI } from "@/analyzers/mcla.api"

type ProgressCallback = (
  percent: number,
  downloaded: number,
  chunk: number,
) => void

async function progressFetch(
  url: string,
  callback: ProgressCallback,
): Promise<Response> {
  const resp = await fetch(url)
  const contentLength =
    Number.parseInt(resp.headers.get("Content-Length") || "") * 2 || 1024 * 1024
  callback(0, 0, 0)

  if (!resp.body) {
    return resp
  }
  const reader = resp.body.getReader()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        var downloaded = 0
        var chunk: Uint8Array | undefined
        while (!({ value: chunk } = await reader.read()).done) {
          chunk = chunk as Uint8Array
          downloaded += chunk.byteLength
          const percent = Math.min(downloaded / contentLength, 0.95)
          callback(percent, downloaded, chunk.byteLength)
          controller.enqueue(chunk)
        }
        callback(1, downloaded, 0)
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(stream, { headers: resp.headers })
}

// Memory Utils
var objectsMem: any[] = []
var objIdPool: number[] = []
var objectsRefMap = new Map<any, number>()

function putObj(obj: any): number {
  var id = objectsRefMap.get(obj)
  if (id !== undefined) {
    return id
  }
  if ((id = objIdPool.pop())) {
    objectsMem[id] = obj
  } else {
    id = objectsMem.length
    objectsMem.push(obj)
  }
  objectsRefMap.set(obj, id)
  return id
}

function releaseObj(id: number) {
  const obj = objectsMem[id]
  objectsMem[id] = null
  objectsRefMap.delete(obj)
  objIdPool.push(id)
}

// Database Utils
function openDB(
  name: string,
  version: number,
  onupgrade: (db: IDBDatabase, oldVersion: number) => void,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const res = indexedDB.open(name, version)
    res.onerror = reject
    res.onsuccess = () => {
      resolve(res.result)
    }
    res.onupgradeneeded = (event) => {
      onupgrade(res.result, event.oldVersion)
    }
  })
}

function wrapDBReq<T>(req: IDBRequest<T>): Promise<IDBRequest<T>> {
  return new Promise((resolve, reject) => {
    req.onerror = reject
    req.onsuccess = () => resolve(req)
  })
}

class DBStorage {
  private _db: IDBDatabase

  constructor(db: IDBDatabase) {
    this._db = db
  }

  private _newTrans() {
    const transaction = this._db.transaction(["localStorage"], "readwrite")
    transaction.oncomplete = () => {}
    transaction.onabort = () => {}
    transaction.onerror = (event) => {
      console.error("Transaction on error:", event)
    }
    return transaction
  }

  private _getStore() {
    return this._newTrans().objectStore("localStorage")
  }

  private _getIndex() {
    return this._getStore().index("k")
  }

  private _openCursor() {
    return this._getStore().openCursor()
  }

  keys(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const keys: string[] = []
      const request = this._openCursor()
      request.onerror = reject
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          const key = cursor.primaryKey
          if (typeof key === "string") {
            console.debug(key, cursor.value)
            keys.push(key)
          }
          cursor.continue()
        } else {
          resolve(keys)
        }
      }
    })
  }

  async getItem(key: string): Promise<string | undefined> {
    const res = (await wrapDBReq(this._getIndex().get(key))).result
    if (res) {
      return res.v
    }
    return undefined
  }

  async setItem(key: string, value: string): Promise<void> {
    await wrapDBReq(this._getStore().put({ k: key, v: value }))
  }

  async removeItem(key: string): Promise<void> {
    await wrapDBReq(this._getStore().delete(key))
  }
}

declare global {
  var Go: any
  var MCLA: MCLAAPI | undefined
  var localStorage: DBStorage
}

interface SetupData {
  wasm_exec: string
  wasm_url: string
}

const fetchProgCallback = (percent: number): void => {
  globalThis.postMessage({
    type: "load-progress",
    percent: percent,
  })
}

async function setup(data: SetupData) {
  globalThis.localStorage = new DBStorage(
    await openDB("mcla-worker-localStorage", 1, (db) => {
      const localStore = db.createObjectStore("localStorage", { keyPath: "k" })
      localStore.createIndex("k", "k", { unique: true })
    }),
  )

  console.debug(`Loading MCLA from ${data.wasm_url} ...`)
  await import(/* @vite-ignore */ data.wasm_exec) // set variable `globalThis.Go`
  const go = new globalThis.Go()
  var res
  if (WebAssembly.instantiateStreaming) {
    res = await WebAssembly.instantiateStreaming(
      progressFetch(data.wasm_url, fetchProgCallback),
      go.importObject,
    )
  } else {
    res = await progressFetch(data.wasm_url, fetchProgCallback)
      .then((res) => res.arrayBuffer())
      .then((bts) => WebAssembly.instantiate(bts, go.importObject))
  }
  go.run(res.instance)
  // the global variable MCLA cannot be defined instantly, so we have to poll it
  const waitMCLA = (): void | Promise<void> => {
    if (globalThis.MCLA) {
      return
    }
    return new Promise((re) => setTimeout(re, 10)) // sleep 10ms
      .then(waitMCLA)
  }
  await waitMCLA()
}

type AnyFunc = (...args: any[]) => any

function wrapRes(res: any) {
  switch (typeof res) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return res
    case "function":
      return {
        __worker_function: true,
        ptr: putObj(res),
      }
    case "object": {
      if (res === null) {
        return res
      }
      if (res instanceof Array) {
        const obj = new Array(res.length)
        for (let i = 0; i < res.length; i++) {
          obj[i] = wrapRes(res[i])
        }
        return obj
      }
      const obj: { [key: string | symbol]: any } = {}
      for (const k of Reflect.ownKeys(res)) {
        const v = res[k]
        if (typeof v === "function") {
          obj[k] = {
            __worker_function: true,
            ptr: putObj((...args: any[]): any => res[k](...args)),
          }
        } else {
          obj[k] = wrapRes(v)
        }
      }
      return obj
    }
  }
  throw new Error("Unknown type of res: " + typeof res)
}

globalThis.onmessage = async function (event) {
  const { data } = event
  try {
    switch (data.type) {
      case "setup":
        await setup(data)
        this.postMessage({
          type: "reply",
          id: data.__id,
          version: MCLA?.version,
        })
        break
      case "call": {
        const name = data.name as keyof MCLAAPI
        const args = data.args as any[]
        if (!MCLA) {
          throw `MCLA is undefined`
        }
        const fn = MCLA[name]
        if (typeof fn !== "function") {
          throw `MCLA.${String(name)} is not a function`
        }
        const res = await (fn as AnyFunc)(...args)
        this.postMessage({
          type: "reply",
          id: data.__id,
          res: wrapRes(res),
        })
        break
      }
      case "callObj": {
        const ptr = data.ptr as number
        const args = data.args as any[]
        const fn = objectsMem[ptr]
        if (typeof fn !== "function") {
          throw `Object [${ptr}] is not a function`
        }
        const res = await (fn as AnyFunc)(...args)
        this.postMessage({
          type: "reply",
          id: data.__id,
          res: wrapRes(res),
        })
        break
      }
      case "releaseObj": {
        releaseObj(data.ptr)
        break
      }
    }
  } catch (err) {
    if (data.__id !== undefined) {
      this.postMessage({
        type: "reply",
        id: data.__id,
        error: String(err),
      })
    }
  }
}
