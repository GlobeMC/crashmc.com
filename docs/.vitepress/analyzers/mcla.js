
import { useCDN } from "../cdn"

const GO_WASM_EXEC_URL = useCDN("https://kmcsr.github.io/mcla/wasm_exec.js")
const MCLA_WASM_URL = useCDN("https://kmcsr.github.io/mcla/mcla.wasm")
export const MCLA_GH_DB_PREFIX = useCDN("https://raw.githubusercontent.com/kmcsr/mcla-db-dev/main")

export async function loadMCLA(){
  await import(GO_WASM_EXEC_URL /* @vite-ignore */) // set variable `window.Go``
  const go = new Go()
  const res = await WebAssembly.instantiateStreaming(fetch(MCLA_WASM_URL), go.importObject)
  go.run(res.instance)
  // the global variable MCLA cannot be defined instantly, so we have to poll it
  function waitMCLA(){
    if(window.MCLA){
      return
    }
    return new Promise((re) => {
      setTimeout(re, 10)
    }).then(waitMCLA)
  }
  await waitMCLA()
  return window.MCLA
}
