function openDB(name, version, onupgrade) {
  return new Promise((resolve, reject) => {
    const res = indexedDB.open(name, version)
    res.onerror = (event) => {
      reject(event)
    }
    res.onsuccess = (event) => {
      resolve(event.target.result)
    }
    res.onupgradeneeded = (event) => {
      onupgrade(event.target.result, event.oldVersion)
    }
  })
}

function wrapDBReq(req) {
  return new Promise((resolve, reject) => {
    req.onerror = reject
    req.onsuccess = resolve
  })
}

class DBStorage {
  constructor(db) {
    this._db = db
    this._transaction = null
  }

  _newTrans() {
    let transaction = this._db.transaction(["localStorage"], "readwrite")
    transaction.oncomplete = () => {}
    transaction.onabort = () => {}
    transaction.onerror = (event) => {
      console.error("Transaction on error:", event)
    }
    return transaction
  }

  _getStore() {
    return this._newTrans().objectStore("localStorage")
  }

  _getIndex() {
    return this._getStore().index("k")
  }

  async getItem(key) {
    const res = (await wrapDBReq(this._getIndex().get(key))).target.result
    if (res) {
      return res.v
    }
    return undefined
  }

  async setItem(key, value) {
    await wrapDBReq(this._getStore().put({ k: key, v: value }))
    return
  }

  async removeItem(key) {
    await wrapDBReq(this._getStore().delete(key))
    return
  }
}

async function setup(wasm_url) {
  globalThis.localStorage = new DBStorage(
    await openDB("mcla-worker-localStorage", 1, (db) => {
      const localStore = db.createObjectStore("localStorage", { keyPath: "k" })
      localStore.createIndex("k", "k", { unique: true })
    }),
  )

  const go = new Go()
  var res
  if (WebAssembly.instantiateStreaming) {
    res = await WebAssembly.instantiateStreaming(
      fetch(wasm_url),
      go.importObject,
    )
  } else {
    res = await fetch(wasm_url)
      .then((res) => res.arrayBuffer())
      .then((bts) => WebAssembly.instantiate(bts, go.importObject))
  }
  go.run(res.instance)
  // the global variable MCLA cannot be defined instantly, so we have to poll it
  function waitMCLA() {
    if (this.MCLA) {
      return
    }
    return new Promise((re) => setTimeout(re, 10)) // sleep 10ms
      .then(waitMCLA)
  }
  await waitMCLA()
}

var objectsMap = []
var objIdPool = []
function putObj(obj) {
  if (objIdPool.length) {
    let i = objIdPool.pop()
    objectsMap[i] = obj
    return i
  }
  let i = objectsMap.length
  objectsMap.push(obj)
  return i
}
function releaseObj(i) {
  objectsMap[i] = null
  objIdPool.push(i)
}

function wrapRes(res) {
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
    case "object":
      if (res === null) {
        return res
      }
      if (res instanceof Array) {
        let obj = new Array(res.length)
        for (let i = 0; i < res.length; i++) {
          obj[i] = wrapRes(res[i])
        }
        return obj
      }
      let obj = new Object()
      for (let k of Reflect.ownKeys(res)) {
        let v = res[k]
        if (typeof v === "function") {
          obj[k] = {
            __worker_function: true,
            ptr: putObj((...args) => res[k](...args)),
          }
        } else {
          obj[k] = wrapRes(v)
        }
      }
      return obj
  }
  throw new Error("Unknown type of res: " + typeof res)
}

this.onmessage = async (event) => {
  const { data } = event
  try {
    switch (data.type) {
      case "setup":
        await this.importScripts(data.wasm_exec /* @vite-ignore */) // set variable `this.Go`
        await setup(data.wasm_url)
        this.postMessage({
          _id: data._id,
          version: MCLA.version,
        })
        break
      case "call": {
        let fn = MCLA[data.name]
        if (typeof fn !== "function") {
          throw `MCLA.${data.name} is not a function`
        }
        let res = await fn(...data.args)
        this.postMessage({
          _id: data._id,
          res: wrapRes(res),
        })
        break
      }
      case "callObj": {
        let fn = objectsMap[data.ptr]
        if (typeof fn !== "function") {
          throw `Object [${data.ptr}] is not a function`
        }
        let res = await fn(...data.args)
        this.postMessage({
          _id: data._id,
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
    if (typeof data._id !== "undefined") {
      this.postMessage({
        _id: data._id,
        _error: String(err),
      })
    }
  }
}
