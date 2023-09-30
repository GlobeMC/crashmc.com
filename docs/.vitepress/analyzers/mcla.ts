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

const VERSION = "v0.4.13"
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
  parseCrashReport(log: readable): Promise<CrashReport>
  parseLogErrors(log: readable): Promise<JavaError[]>
  analyzeLogErrors(log: readable): Promise<ErrorResult[]>
  analyzeLogErrorsIter(log: readable): Promise<AsyncIterator<ErrorResult>>
}

async function loadMCLA(): Promise<MCLAAPI> {
  await import(GO_WASM_EXEC_URL /* @vite-ignore */) // set variable `window.Go`
  const go = new window.Go()
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
    if (window.MCLA) {
      return
    }
    return new Promise((re) => setTimeout(re, 10)) // sleep 10ms
      .then(waitMCLA)
  }
  await waitMCLA()
  return window.MCLA
}
