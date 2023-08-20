import { useCDN } from "../cdn"

const GO_WASM_EXEC_URL = useCDN("https://kmcsr.github.io/mcla/wasm_exec.js")
const MCLA_WASM_URL = useCDN("https://kmcsr.github.io/mcla/mcla.wasm")
export const MCLA_GH_DB_PREFIX = useCDN(
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
  caused_by: JavaError
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
  affected_level: AffectedLevel
  others: Map<string, DetailsItem>
}

interface SolutionPossibility {
  solutions: number[]
  match: number
}

interface ErrorResult {
  error: JavaError
  matched: SolutionPossibility[]
}

interface MCLAType {
  version: string
  parseCrashReport(log: readable): CrashReport
  parseLogErrors(log: readable): JavaError[]
  analyzeLogErrors(log: readable): ErrorResult[]
}

export async function loadMCLA(): MCLAType {
  await import(GO_WASM_EXEC_URL /* @vite-ignore */) // set variable `window.Go``
  const go = new Go()
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
  function waitMCLA(): void {
    if (window.MCLA) {
      return
    }
    return new Promise((re) => {
      setTimeout(re, 10)
    }).then(waitMCLA)
  }
  await waitMCLA()
  return window.MCLA
}
