export type {
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
	Solution,
	MCLAAPI,
}

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
	file?: string
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
	analyzeLogErrorsIter(log: readable): Promise<AsyncIterable<ErrorResult>>
}
