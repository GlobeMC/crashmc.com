<script setup lang="ts">
import JSZip from "jszip"
import pako from "pako"
import { TarReader } from "@gera2ld/tarjs"
import { useRouter } from "vitepress/client"
import { type Ref, ref, watch, onBeforeMount, onUnmounted } from "vue"
import axios from "axios"
import AnalyzingIcon from "./icons/AnalyzingIcon.vue"
import OpenTabIcon from "./icons/OpenTabIcon.vue"
import UploadIcon from "./icons/UploadIcon.vue"
import TransitionExpand from "./TransitionExpand.vue"
import TransitionExpandGroup from "./TransitionExpandGroup.vue"
import {
	type MCLAAPI,
	type JavaError,
	type Solution,
	loadMCLA,
	MCLA_GH_DB_PREFIX,
} from "@/theme/analyzers/mcla"
import type { ITarFileInfo } from "@gera2ld/tarjs"

// 类型&接口定义
interface SolutionOkSuccess {
	ok: true
	res: Solution
}

interface SolutionOkFailed {
	ok: false
	id: number // solution id
	error: string
}

type SolutionOk = SolutionOkSuccess | SolutionOkFailed

interface ErrDesc {
	error: string
	message: string
	solutions: SolutionOk[]
}

interface SolutionMatch {
	match: number
	desc: ErrDesc
}

interface AnalysisResult {
	filepath: string
	error: JavaError
	matched: SolutionMatch[]
	viewlink: string
}

/**
 * In memory file struct
 */
class MemFile {
	readonly data: Uint8Array
	readonly path: string
	text?: string // only present when it's a vaild text file
	private blobURL?: string

	constructor(data: Uint8Array, path: string) {
		this.data = data
		this.path = path
	}

	get name(): string {
		let path = this.path
		if (path.endsWith("/")) {
			// remove '/' suffix
			path = path.substring(0, path.length - 1)
		}
		let i = path.lastIndexOf("/")
		if (i >= 0) {
			return path.substring(i + 1)
		}
		return path
	}

	getBlobURL(): string {
		if (!this.blobURL) {
			if (!this.text) {
				throw new Error("Cannot create blob for non-text file")
			}
			const blob = new Blob([this.text], {
				type: "text/plain",
			})
			this.blobURL = URL.createObjectURL(blob)
		}
		return this.blobURL
	}
}

class AnalysisError {
	readonly type: string
	readonly reason: any
	constructor(type: string, reason: any) {
		this.type = type
		this.reason = reason
	}

	get message(): string {
		return String(this.reason)
	}

	toString(): string {
		let s = this.type
		if (this.reason) {
			s += ": " + this.message
		}
		return s
	}
}

// 常量
const router = useRouter()
const utf8Decoder = new TextDecoder("utf-8")

// 元素引用
const fileUploader = ref()

// 模版变量初始化
const mclaLoadingProcess = ref(0)
const analyzerBackgroundColor = ref("")
const analyzing = ref(false)
const analysisShowResult = ref(false)
const analysisResults: Ref<AnalysisResult[]> = ref([])
const isBtnDisabled = ref(false)
const labelMsg = ref("未选择文件")
const btnMsg = ref("开始上传")
const analysisResultMsg = ref("")
const redirectUrl: Ref<string | null> = ref(null)
const redirectMsg = ref("导航到解决方案")
const showAnalyzingIcon = ref(false)
watch(
	analyzing,
	(() => {
		// we have to wait a second before trigger the analyzing icon to make better performance
		var switchInterval: Promise<void> | null = null
		return async () => {
			if (switchInterval) {
				await switchInterval
				switchInterval = null
			}
			const value = analyzing.value
			if (value) {
				switchInterval = new Promise((re) => setTimeout(re, 1000))
			}
			showAnalyzingIcon.value = value
		}
	})(),
)

// 公共变量
var MCLA: MCLAAPI | null = null
var launcher = "Unknown"

const SYSTEM_URL = "/client/system.html" // 系统问题
const VANILLA_URL = "/client/vanilla.html" // 原版问题
const MODS_URL = "/client/mods.html" // Mod 问题
const MIXIN_URL = "/mixin.html" // Mod 问题

// 阻止浏览器默认拖拽行为
function handleDragEnter(): void {
	analyzerBackgroundColor.value = "rgba(255,255,255,0.5)"
}

// 动画
function handleDragOver(): void {
	analyzerBackgroundColor.value = "rgba(255,255,255,0.5)"
}

// 动画
function handleDragLeave(): void {
	analyzerBackgroundColor.value = "var(--vp-custom-block-tip-bg)"
}

// 动画
function handleDrop(e: DragEvent) {
	const files = e.dataTransfer?.files // 获取拖拽过来的文件
	if (files) {
		// 处理文件
		handleDropFiles(files)
	}
}

/**
 * 拖拽文件处理。
 * @param {File} files 拖拽的文件。
 */
function handleDropFiles(files: FileList) {
	console.debug("文件拖拽:", files)
	analyzerBackgroundColor.value = "var(--vp-custom-block-tip-bg)"
	analyzeFiles(files)
}

/**
 * 重新初始化。
 */
function clean() {
	console.log("重新初始化")
	analysisShowResult.value = false
	analysisResults.value = []
	analysisResultMsg.value = "分析器歇逼了"
	redirectMsg.value = "导航到解决方案"
	redirectUrl.value = null
}

function checkFiles(): Promise<boolean> {
	const fup = fileUploader.value
	return analyzeFiles(fup.files as FileList)
}

/**
 * 分析文件。可以分析返回 true，不能分析返回 false。
 */
async function analyzeFiles(files: FileList): Promise<boolean> {
	clean()
	launcher = "Unknown"
	if (files.length <= 0) {
		labelMsg.value = "请上传至少一个文件"
		return false
	}
	btnMsg.value = "正在分析"
	isBtnDisabled.value = true
	if (files.length === 1) {
		labelMsg.value = files[0].name
	} else {
		// files.length > 1
		labelMsg.value = `${files[0].name} 等 ${files.length} 个文件`
	}
	return startAnalysis(Array.from(files))
}

class _fallbackAnalysisDoneErr {}
const fallbackAnalysisDoneErr = new _fallbackAnalysisDoneErr()

/**
 * 开始分析文件
 * @param {File[]} files 文件对象列表
 */
async function startAnalysis(files: File[]): Promise<boolean> {
	if (analyzing.value) {
		console.error("日志已经开始分析了?")
		return false
	}
	analyzing.value = true
	console.log("开始分析日志")
	var analyzed = false
	try {
		await Promise.all(
			files.map((file) =>
				file
					.arrayBuffer()
					.then((buf) => readFiles(new MemFile(new Uint8Array(buf), file.name)))
					.then((files: MemFile[]) =>
						Promise.all(
							files.map((file) => {
								analyzed = true
								if (MCLA) {
									return mclAnalysis(file).catch((err) => {
										console.error("MCLA error:", err)
										throw new AnalysisError("MCLA-Error", err)
									})
								} else {
									console.debug("MCLA is not loaded")
								}
								if (analysisResults.value.length === 0) {
									return logAnalysis(file.text as string).then((ok) => {
										if (ok) {
											throw fallbackAnalysisDoneErr
										}
									})
								}
							}),
						),
					),
			),
		)
	} catch (err) {
		if (err === fallbackAnalysisDoneErr) {
			return true
		}
		if (err instanceof AnalysisError) {
			finishAnalysis(err.type, err.message)
		} else {
			console.error("Unexpected analysis error:", err)
			finishAnalysis("UnexpectedError", String(err))
		}
		return false
	}
	if (!analyzed) {
		console.warn("日志获取完成，没有获取到可用日志")
		finishAnalysis("EmptyLogErr", "(＃°Д°)")
		return false
	}
	console.debug("MCLA analysisResults:", analysisResults.value)
	if (analysisResults.value.length > 0) {
		showAnalysisResult(
			"Success",
			"MCLA 分析完成, 但您不应该在页面上看到本消息 -.-",
			"https://github.com/GlobeMC/mcla",
			"Multiple reasons",
		)
		return true
	}
	console.log("日志分析结束，没有找到可能的原因")
	showAnalysisResult(
		"Unrecord",
		"本工具还未收录您所遇到的错误，请点击下方按钮前往 GitHub 反馈。",
		"/contribute/crash-report",
		"Unrecord",
	)
	return false
}

/**
 * 读取文件, 并递归解压压缩文件
 * @param {MemFile} file 文件对象
 */
async function readFiles(file: MemFile, filename?: string): Promise<MemFile[]> {
	var data = file.data
	filename = (filename || file.name).toLowerCase()
	let i = filename.lastIndexOf(".")
	const ext = filename.substring(i + 1)
	const filebase = filename.substring(0, i)
	switch (ext) {
		case "gz":
		case "gzip":
		case "z":
		case "zlib":
			try {
				data = pako.inflate(data)
			} catch (error) {
				console.error(`Couldn't decompress file with ext ${ext}:`, error)
				throw new AnalysisError("UnzipErr", error)
			}
			return readFiles(new MemFile(data, file.path), filebase)
		case "tgz": // as same as tar.gz
			try {
				data = pako.inflate(data)
			} catch (error) {
				console.error(`Couldn't decompress file with ext ${ext}:`, error)
				throw new AnalysisError("UnzipErr", error)
			}
			return readFiles(new MemFile(data, file.path), filebase)
		case "tar": {
			let files
			try {
				files = await TarReader.load(data)
			} catch (error) {
				console.error("Couldn't read the tar file:", error)
				throw new AnalysisError("UnzipErr", error)
			}

			let res: MemFile[] = []
			await Promise.all(
				files.fileInfos
					.filter(
						(f: ITarFileInfo) =>
							!f.name.startsWith("._") &&
							!f.name.toLowerCase().startsWith("paxheader/"),
					)
					.map((f: ITarFileInfo) =>
						readFiles(
							new MemFile(
								new Uint8Array(data.buffer, f.headerOffset + 512, f.size),
								file.path + "/" + f.name,
							),
							f.name,
						).then((fls) => res.push(...fls)),
					),
			)
			return res
		}
		case "zip": {
			let zip = new JSZip()
			try {
				// 从本地或 URL 加载一个 Zip 文件
				await zip.loadAsync(data)
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Encrypted zip are not supported") {
						throw new AnalysisError("EncryptedZipFile", error)
					}
				}
				console.error("Couldn't read the zip file:", error)
				throw new AnalysisError("UnzipErr", error)
			}

			let res: MemFile[] = []
			await Promise.all(
				Object.values(zip.files)
					.filter((f) => !f.dir)
					.map((f) =>
						f
							.async("uint8array")
							.then((buf) =>
								readFiles(new MemFile(buf, file.path + "/" + f.name), f.name),
							)
							.then((fls) => res.push(...fls)),
					),
			)
			return res
		}
		case "log":
		case "txt":
			// Log / Txt 文件处理
			try {
				file.text = utf8Decoder.decode(data)
			} catch (err) {
				// 日志读取错误
				throw new AnalysisError("ReadLogErr", err)
			}
			return [file]
		default:
			return []
	}
}

// MCLA错误分析
async function mclAnalysis(file: MemFile): Promise<void> {
	if (!MCLA) {
		return
	}
	const filepath = file.path
	const resultIter = await MCLA.analyzeLogErrorsIter(file.text as string)
	var promises: Promise<any>[] = []
	for await (const result of resultIter) {
		if (!result.matched || result.matched.length === 0) {
			continue
		}
		promises.push(
			Promise.all(
				result.matched
					.filter(({ match }) => match >= 0.5) // >= 50%
					.sort((a, b) => b.match - a.match) // x.match 降序排序
					.map(({ match, errorDesc }) => {
						return Promise.all(
							errorDesc.solutions.map((id) =>
								axios
									.get<Solution>(`${MCLA_GH_DB_PREFIX}/solutions/${id}.json`)
									.then(
										(res): SolutionOkSuccess => ({ ok: true, res: res.data }),
									)
									.catch(
										(err): SolutionOkFailed => ({
											ok: false,
											id: id,
											error: String(err),
										}),
									),
							),
						).then((solutions) => ({
							match: match,
							desc: {
								error: errorDesc.error,
								message: errorDesc.message,
								solutions: solutions,
							},
						}))
					}),
			).then(
				(matched) =>
					matched.length &&
					analysisResults.value.push({
						filepath: filepath,
						error: result.error,
						matched: matched,
						viewlink: `/log-viewer.html?type=blob&link=${escape(
							file.getBlobURL(),
						)}&name=${escape(filepath)}#L${result.error.lineNo}`,
					}),
			),
		)
	}
	await Promise.all(promises)
	return
}

/**
 * 分析日志，并展示分析结果。
 * @param {string} log Log 原文。
 */
async function logAnalysis(log: string): Promise<boolean> {
	// 启动器判断 (最准)
	if (log.includes("PCL")) {
		launcher = "PCL"
	} else if (log.includes("HMCL")) {
		launcher = "HMCL"
	} else if (log.includes("BakaXL")) {
		launcher = "BakaXL"
	}

	// 错误判断

	// 内存不足
	if (
		log.includes("java.lang.OutOfMemoryError") ||
		log.includes("Could not reserve enough space")
	) {
		showAnalysisResult(
			"Success",
			"Java 内存分配不足",
			SYSTEM_URL + "#内存问题",
			"内存不足",
		)

		// 32 位超过 1G
	} else if (
		log.includes("Could not reserve enough space for 1048576KB object heap")
	) {
		showAnalysisResult(
			"Success",
			"32 位 Java 内存分配超过 1 G",
			SYSTEM_URL + "#内存问题",
			"32_Bit_Java_Memory",
		)

		// 显卡驱动问题
	} else if (
		log.includes("Couldn't set pixel format") ||
		log.includes("Pixel format not accelerated") ||
		log.includes("The driver does not appear to support OpenGL")
	) {
		showAnalysisResult(
			"Success",
			"显卡 / 显卡驱动问题",
			SYSTEM_URL + "#显卡-显卡驱动问题",
			"GPU_DRIVER",
		)

		// OpenJ9
	} else if (
		log.includes("Open J9 is not supported") ||
		log.includes("OpenJ9 is incompatible") ||
		log.includes(".J9VMInternals.")
	) {
		showAnalysisResult(
			"Success",
			"使用了 OpenJ9",
			SYSTEM_URL + "#使用-openj9",
			"Used_OpenJ9",
		)

		// .DS_Store
	} else if (
		log.includes(
			"Caused by: net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:",
		) ||
		log.includes(
			"net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:",
		)
	) {
		showAnalysisResult(
			"Success",
			"存在 .DS_Store 文件导致报错",
			SYSTEM_URL + "#mac-下存在-ds-store-文件导致报错",
			"DS_Store",
		)

		// OpenGL 窗口问题
	} else if (
		log.search(
			/java.lang.IllegalStateException: GLFW error before init: [*]Cocoa: Failed to find service port for display/,
		) != -1
	) {
		showAnalysisResult(
			"Success",
			"Mac 下初始化 OpenGL 窗口问题",
			SYSTEM_URL + "#mac-下初始化-opengl-窗口问题",
			"Mac_OpenGL_Init",
		)

		// 页面文件太小
	} else if (log.includes("页面文件太小，无法完成操作。")) {
		showAnalysisResult(
			"Success",
			"页面文件太小",
			SYSTEM_URL + "#页面文件问题",
			"页面文件太小",
		)

		// 存档损坏
	} else if (
		log.search(/Exception reading [*]\\level.dat/) != -1 ||
		log.includes(
			"Caused by: java.util.zip.ZipException: invalid distance too far back",
		) ||
		log.includes("net.minecraft.util.crash.CrashException: Loading NBT data")
	) {
		showAnalysisResult(
			"Success",
			"存档损坏",
			VANILLA_URL + "#存档损坏",
			"存档损坏",
		)

		// 资源包过大
	} else if (log.includes("Maybe try a lower resolution resourcepack?")) {
		showAnalysisResult(
			"Success",
			"资源包过大",
			VANILLA_URL + "#资源包过大",
			"资源包过大",
		)

		// 文件校验失败
	} else if (
		log.includes(
			"signer information does not match signer information of other classes in the same package",
		)
	) {
		showAnalysisResult(
			"Success",
			"文件校验失败",
			VANILLA_URL + "#文件校验失败",
			"文件校验失败",
		)

		// Mod 问题
		// Java 版本不匹配
	} else if (
		log.includes("java.lang.UnsupportedClassVersionError") ||
		log.includes("Unsupported class file major version") ||
		log.includes("no such method: sun.misc.Unsafe.defineAnonymousClass")
	) {
		showAnalysisResult(
			"Success",
			"Java 版本不匹配",
			MODS_URL + "#java-版本不匹配",
			"Java 版本不匹配",
		)

		// Mod 重复安装
	} else if (
		log.includes("DuplicateModsFoundException") ||
		log.includes("Found a duplicate mod") ||
		log.includes("ModResolutionException: Duplicate")
	) {
		showAnalysisResult(
			"Success",
			"Mod 重复安装",
			MODS_URL + "#mod-重复安装",
			"Mod 重复安装",
		)

		// Mod 过多导致超出 ID 限制
	} else if (log.includes("maximum id range exceeded")) {
		showAnalysisResult(
			"Success",
			"Mod 过多导致超出 ID 限制",
			MODS_URL + "#mod-过多导致超出-id-限制",
			"Mod 过多导致超出 ID 限制",
		)

		// 解压了 Mod
	} else if (
		log.includes(
			"The directories below appear to be extracted jar files. Fix this before you continue.",
		) ||
		log.includes("Extracted mod jars found, loading will NOT continue")
	) {
		showAnalysisResult(
			"Success",
			"解压了 Mod",
			MODS_URL + "#解压了-mod",
			"解压了 Mod",
		)

		// Mod 名称含有特殊字符
	} else if (log.includes("Invalid module name: '' is not a Java identifier")) {
		showAnalysisResult(
			"Success",
			"Mod 名称含有特殊字符",
			MODS_URL + "#mod-名称含有特殊字符",
			"Mod 名称含有特殊字符",
		)

		// Mod 文件损坏
	} else if (
		log.includes(
			"Caused by: java.util.zip.ZipException: zip END header not found",
		)
	) {
		showAnalysisResult(
			"Success",
			"Mod 文件损坏",
			MODS_URL + "#mod-文件损坏",
			"Mod 文件损坏",
		)

		// 一些 Mod 需要访问国外网络
	} else if (
		log.includes("modpack-update-checker") ||
		log.includes("commonality")
	) {
		showAnalysisResult(
			"Success",
			"一些 Mod 需要访问国外网络",
			MODS_URL + "#一些-mod-需要访问国外网络",
			"一些 Mod 需要访问国外网络",
		)

		// Forge Json 问题
	} else if (
		log.includes(
			"Found multiple arguments for option fml.forgeVersion, but you asked for only one",
		)
	) {
		showAnalysisResult(
			"Success",
			"Forge Json 问题",
			MODS_URL + "#json-问题",
			"Forge Json 问题",
		)

		// Night Config 库问题
	} else if (
		log.includes("forge") &&
		log.includes(
			"Caused by: com.electronwill.nightconfig.core.io.ParsingException: Not enough data available",
		)
	) {
		showAnalysisResult(
			"Success",
			"Night Config 库问题",
			MODS_URL + "#night-config-库的问题",
			"Night Config 库问题",
		)

		// Forge 缺少前置
	} else if (
		log.includes("forge") &&
		log.includes("Missing or unsupported mandatory dependencies:") &&
		log.includes("neoforge") == false
	) {
		var missingMod = []
		// 按行分割日志
		var spilted = log.split("\n")
		// 获取缺少的 Mod 信息
		for (let key in spilted) {
			if (
				spilted[key].includes("Mod ID: ") ||
				spilted[key].includes(", Requested by: ")
			) {
				// 正则匹配单引号内内容
				let matches = spilted[key].match(/'([^']+)'/g)
				if (matches) {
					missingMod.push(
						matches[0].replace(/'/g, "") +
							" " + // Mod 名称，例如 'oculus'
							matches[2]
								.replace(/'/g, "")
								.replace(/\$\{minecraft_version\}/g, "MinecraftVersion"), // Mod 版本，例如 '[1.4,)'，之后可以把最低 / 最高版本提取出来解析一遍
					)
				}
			}
		}
		missingMod = Array.from(new Set(missingMod)) // 数组去重
		// 转为字符串
		var missingStr = ""
		for (let key in missingMod) {
			missingStr = missingStr + "; " + missingMod[key]
		}
		missingStr = missingStr.substring(2) // 去除开头的逗号
		showAnalysisResult(
			"Success",
			"Forge 缺少前置 Mod：" + missingStr,
			MODS_URL + "#缺少前置",
			"Forge 缺少前置 Mod",
		)

		// NeoForge 缺少前置
	} else if (
		log.includes("neoforge") &&
		log.includes("Missing or unsupported mandatory dependencies:")
	) {
		showAnalysisResult(
			"Success",
			"NeoForge 缺少前置 Mod",
			MODS_URL + "#缺少前置-1",
			"NeoForge 缺少前置 Mod",
		)

		// Fabric Mod 版本不兼容
	} else if (
		log.includes("fabric") &&
		log.includes("but only the wrong version is present")
	) {
		showAnalysisResult(
			"Success",
			"Fabric Mod 版本不兼容",
			MODS_URL + "#版本不兼容",
			"Fabric Mod 版本不兼容",
		)

		// Fabric Mod 缺少前置
	} else if (
		log.includes("fabric") &&
		log.includes("Unmet dependency listing:") &&
		log.includes("requires") &&
		log.includes("which is missing!") &&
		log.includes("is incompatible with") == false
	) {
		showAnalysisResult(
			"Success",
			"Fabric Mod 缺少前置",
			MODS_URL + "#缺少前置-2",
			"Fabric Mod 缺少前置",
		)

		// Fabric Mod 冲突
	} else if (
		log.includes(
			"net.fabricmc.loader.impl.FormattedException: Mod resolution encountered an incompatible mod set!",
		) &&
		log.includes("that is compatible with") &&
		log.includes("is incompatible with")
	) {
		showAnalysisResult(
			"Success",
			"Fabric Mod 冲突",
			MODS_URL + "#mod-冲突",
			"Fabric Mod 冲突",
		)

		// Quilt Mod 缺少前置
	} else if (log.includes("quilt") && log.includes("which is missing!")) {
		showAnalysisResult(
			"Success",
			"Quilt Mod 缺少前置",
			MODS_URL + "#缺少前置-3",
			"Quilt Mod 缺少前置",
		)

		// LiteLoader 与 Forge 冲突
	} else if (
		log.includes("forge") &&
		log.includes("liteloader") &&
		log.includes(
			"org.spongepowered.asm.service.ServiceInitialisationException: ModLauncher is not available",
		) &&
		log.includes("neoforge") == false
	) {
		showAnalysisResult(
			"Success",
			"LiteLoader 与 Forge 冲突",
			MODS_URL + "#与-forge-冲突",
			"LiteLoader 与 Forge 冲突",
		)

		// OptiFine 无法加载世界
	} else if (
		log.includes(
			"java.lang.NoSuchMethodError: net.minecraft.world.server.ChunkManager$ProxyTicketManager.shouldForceTicks(J)Z",
		)
	) {
		showAnalysisResult(
			"Success",
			"OptiFine 导致无法加载世界",
			MODS_URL + "#无法加载世界",
			"OptiFine 导致无法加载世界",
		)

		// Forge 与 OptiFine 兼容性问题导致的崩溃
	} else if (
		log.includes(
			"java.lang.NoSuchMethodError: 'void net.minecraftforge.client.gui.overlay.ForgeGui.renderSelectedItemName(net.minecraft.client.gui.GuiGraphics, int)'",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: 'java.lang.Class sun.misc.Unsafe.defineAnonymousClass(java.lang.Class, byte[], java.lang.Object[])'",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: 'java.lang.String com.mojang.blaze3d.systems.RenderSystem.getBackendDescription()'",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: 'net.minecraft.network.chat.FormattedText net.minecraft.client.gui.Font.ellipsize(net.minecraft.network.chat.FormattedText, int)'",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: 'void net.minecraft.server.level.DistanceManager",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: 'void net.minecraft.client.renderer.block.model.BakedQuad.<init>(int[], int, net.minecraft.core.Direction, net.minecraft.client.renderer.texture.TextureAtlasSprite, boolean, boolean)'",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: 'void net.minecraft.client.renderer.texture.SpriteContents.<init>(net.minecraft.resources.ResourceLocation",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: 'void net.minecraft.server.level.DistanceManager.addRegionTicket(net.minecraft.server.level.TicketType, net.minecraft.world.level.ChunkPos, int, java.lang.Object, boolean)'",
		) ||
		log.includes(
			"java.lang.NoSuchMethodError: net.minecraft.launchwrapper.ITweaker.injectIntoClassLoader(Lnet/minecraft/launchwrapper/LaunchClassLoader;)V",
		) ||
		log.includes(
			"TRANSFORMER/net.optifine/net.optifine.reflect.Reflector.<clinit>(Reflector.java",
		)
	) {
		showAnalysisResult(
			"Success",
			"Forge 与 OptiFine 兼容性问题导致的崩溃",
			MODS_URL + "#forge-与-optifine-兼容性问题导致的崩溃",
			"Forge 与 OptiFine 兼容性问题导致的崩溃",
		)

		// Mixin 注入失败
	} else if (log.includes("Mixin apply for mod") && log.includes("failed")) {
		showAnalysisResult(
			"Success",
			"Mixin 注入失败",
			MIXIN_URL + "#mixin-注入失败",
			"Mixin 注入失败",
		)

		// 以上都无
	} else {
		return false
	}
	return true
}

/**
 * 展示分析结果。
 * @param {string} status 状态消息。
 * @param {string} msg 向用户展示的消息。
 * @param {string} result_url 重定向 Url。
 * @param {string} status_msg 状态信息。
 */
function showAnalysisResult(
	status: string,
	msg: string,
	result_url: string,
	status_msg: string,
) {
	console.log("展示分析结果：(" + status + ") " + msg)
	// 信息更改
	redirectUrl.value = result_url
	analysisResultMsg.value = msg
	analysisShowResult.value = true

	// 结束分析
	finishAnalysis(status, status_msg)
}

// Based on https://umami.is/docs/tracker-functions
declare var umami: {
	track(view_properties?: { website: string; [key: string]: string }): void
	track(
		event_name: string,
		event_data?: { [key: string]: string | number },
	): void
}

function umamiTrack(...args: any[]) {
	try {
		umami.track(...args)
	} catch (err) {
		console.error("umami error:", err)
	}
}

/**
 * 结束分析。
 * @param {string} status 分析状态。
 * @param {string} msg 传递信息。
 */
function finishAnalysis(status: string, msg: string) {
	// 消息更改
	btnMsg.value = "重新上传"
	analyzing.value = false
	isBtnDisabled.value = false
	console.log("结束分析：(" + status + ") ", msg)
	switch (status) {
		case "EmptyLogErr":
			labelMsg.value = "未读取到支持的日志格式, 请尝试直接上传 .log / .txt 文件"
			umamiTrack("Analysis Error", {
				Status: "Unsupport_Log_File_Ext",
				ErrMsg: msg,
			})
			break
		case "ReadLogErr":
			labelMsg.value = "Log 文件读取错误"
			umamiTrack("Analysis Error", {
				Status: "Cannot_Read_Log_File",
				ErrMsg: msg,
			})
			break
		case "UnzipErr":
			labelMsg.value = "日志文件解压错误"
			umamiTrack("Analysis Error", {
				Status: "Cannot_Unzip_Log_File",
				ErrMsg: msg,
			})
			break
		case "EncryptedZipFile":
			labelMsg.value = "不支持加密 zip 文件"
			umamiTrack("Analysis Error", {
				Status: "Cannot_Load_Encrypted_Log_File",
				ErrMsg: msg,
			})
			break
		case "Unrecord":
			redirectMsg.value = "提交反馈"
			umamiTrack("Unrecord Crash", {
				Status: "Unrecord_Crash",
				Launcher: launcher,
			})
			break
		case "Success":
			umamiTrack("Analysis Finish", {
				Status: "Analysis_Success",
				Launcher: launcher,
				CrashReason: msg,
			})
			break
		case "MCLA-Error":
			analysisShowResult.value = true
			analysisResultMsg.value =
				"MCLA 分析器意外退出，请点击下方按钮前往 GitHub 反馈。"
			redirectUrl.value = "https://github.com/GlobeMC/mcla/issues/new"
			redirectMsg.value = "提交反馈"
			umamiTrack("Analysis Error", {
				Status: "MCLA_Error",
				Launcher: launcher,
				CrashReason: msg,
			})
			break
		case "UnexpectedError":
		default:
			labelMsg.value = "未知错误"
			umamiTrack("Analysis Error", {
				Status: "Unknown_Error",
				Launcher: launcher,
			})
			break
	}
}

function redirectTo(url: string | null, newTab?: boolean) {
	if (!url) {
		return
	}
	if (typeof url === "string") {
		if (!newTab && url.startsWith("/")) {
			router.go(url)
		} else {
			window.open(url)
		}
	} else {
		labelMsg.value = "无法重定向到解决方案页面"
		umamiTrack("Analysis Error", {
			Status: "Cannot_Redirect_To_Resolution",
			Launcher: launcher,
			Target: url,
		})
	}
}

onBeforeMount(async () => {
	try {
		MCLA = await loadMCLA(mclaLoadingProcess)
	} catch (err) {
		console.error("Couldn't load MCLA:", err)
	}
})

onUnmounted(() => {
	if (MCLA && MCLA.release) {
		MCLA.release()
		MCLA = null
	}
})
</script>

<template>
	<ClientOnly>
		<div
			class="analyzer-main"
			:style="{ 'background-color': analyzerBackgroundColor }"
			@dragenter.prevent="handleDragEnter"
			@dragover.prevent="handleDragOver"
			@drop.prevent="handleDrop"
			@dragleave.prevent="handleDragLeave">
			<h4 style="text-align: center">
				请点击按钮上传导出的 .zip/.txt/.log 文件, 并尽量不要更改导出文件的名称。
			</h4>
			<UploadIcon
				class="icon-upload"
				:disabled="isBtnDisabled"
				@click="fileUploader.click()" />
			<div class="file-uploader-container">
				<h4 class="file-uploader-label" for="file-uploader" singleLine="false">
					{{ labelMsg }}
				</h4>
				<div v-if="mclaLoadingProcess < 1">
					(MCLA 加载中 {{ (mclaLoadingProcess * 100).toFixed(2) }}%)
				</div>
				<button
					:disabled="isBtnDisabled"
					class="button file-uploader-btn"
					data-umami-event="Analysis Button Click"
					@click="fileUploader.click()">
					{{ btnMsg }}
				</button>
				<input
					id="file-uploader"
					ref="fileUploader"
					name="file_uploader"
					type="file"
					multiple
					style="display: none"
					:disabled="isBtnDisabled"
					@change="checkFiles" />
			</div>
			<TransitionExpand>
				<div v-if="showAnalyzingIcon" class="flex">
					<hr />
					<center>
						<AnalyzingIcon size="3rem" />
					</center>
				</div>
			</TransitionExpand>
			<TransitionExpandGroup name="analysis-result" class="analysis-result-box">
				<template v-if="analysisResults && analysisResults.length > 0">
					<div
						v-for="(result, i) in analysisResults"
						:key="i"
						class="analysis-result-item">
						<h4>错误信息 {{ i + 1 }}</h4>
						<a :href="result.viewlink" target="_blank">
							{{ result.filepath }}:{{ result.error.lineNo }}
						</a>
						<code class="result-parsed-error">
							{{ result.error.class }}: {{ result.error.message }}
						</code>
						<div
							v-for="(match, j) in result.matched"
							:key="j"
							class="result-matches">
							<hr style="margin: 8px 0" />
							<h5 class="result-matched-error-title">
								<span :title="match.desc.error">{{ match.desc.error }}</span>
								<span
									class="result-match-percent"
									:style="
										match.match > 0.8 ? { 'background-color': '#8ef9fc61' } : {}
									">
									匹配度: {{ match.match * 100 }}%
								</span>
							</h5>
							<code class="result-parsed-error">
								{{ match.desc.message }}
							</code>
							<div v-for="(sol, n) in match.desc.solutions" :key="n">
								<div v-if="sol.ok">
									<details :open="false">
										<summary>
											<h5>{{ n + 1 }}. {{ sol.res.description }}</h5>
										</summary>
										<div>
											<b>描述: </b>
											<span>{{ sol.res.description }}</span>
										</div>
										<div>
											<b>解决方案: </b>
											<a target="_blank" :href="sol.res.link_to">
												打开文档
												<OpenTabIcon />
											</a>
										</div>
									</details>
								</div>
								<div v-else>加载错误: ID={{ sol.id }}; {{ sol.error }}</div>
							</div>
						</div>
					</div>
				</template>
				<div v-else-if="analysisShowResult" class="analysis-result-main">
					<hr />
					<h4 class="analysis-result-title">分析结果:</h4>
					<p class="analysis-result-msg">{{ analysisResultMsg }}</p>
					<button class="button" @click="redirectTo(redirectUrl)">
						{{ redirectMsg }}
					</button>
				</div>
			</TransitionExpandGroup>
		</div>
	</ClientOnly>
</template>

<style scoped>
div {
	height: 100%;
	width: 100%;
}

p {
	margin: 0;
	padding: 0;
}

summary > h1,
summary > h2,
summary > h3,
summary > h4,
summary > h5,
summary > h6 {
	display: inline-block;
	user-select: none;
	cursor: default;
}

details > *:not(summary) {
	padding-left: 12px;
}

a {
	cursor: pointer;
}

svg {
	user-select: none;
}

.flex,
.analysis-result-box > * {
	display: flex;
	flex-direction: column;
}

.flex > hr {
	width: 100%;
}

.analyzer-main {
	border: 1px solid transparent;
	border-color: var(--vp-custom-block-tip-border);
	color: var(--vp-custom-block-tip-text);
	background-color: var(--vp-custom-block-tip-bg);
	border-radius: 8px;
	padding: 16px 16px 8px;
	line-height: 24px;
	font-size: var(--vp-custom-block-font-size);
	display: block;
}

.analysis-result-main {
	align-items: center;
	margin: auto;
	width: 100%;
	height: 100%;
}

.analysis-result-main > hr {
	width: 100%;
}

.analysis-result-enter-active,
.analysis-result-leave-active {
	transition: all 0.6s ease-in !important;
}

.analysis-result-enter-from,
.analysis-result-leave-to {
	opacity: 0;
}

.icon-upload {
	margin: auto;
	height: 20%;
	width: 20%;
}

.icon-upload:not([disabled="true"]) {
	cursor: pointer;
}

.file-uploader-container {
	text-align: center;
	margin: auto;
	width: 100%;
	height: 100%;
}

.button {
	margin-top: 3px;
	height: 35px;
	width: 120px;
	border: 1px solid transparent;
	border-color: var(--vp-custom-block-tip-border);
	background-color: var(--vp-custom-block-tip-bg);
	border-radius: 8px;
	transition: transform 0.3s;
}

.button:hover {
	animation-direction: alternate;
	transform: scale(1.05);
}

.analysis-result-item {
	margin: 16px 0;
	padding: 8px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 5px;
}

.analysis-result-item > h4 {
	text-align: center;
}

.result-parsed-error {
	margin-top: 0.5rem;
	color: var(--vp-c-text-1);
	white-space-collapse: preserve;
	text-wrap: pre-wrap;
	overflow: hidden;
	overflow-wrap: anywhere;
}

.result-matched-error-title > span {
	display: inline-block;
	max-width: 100%;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
}

.result-match-percent {
	float: right;
	height: 24px;
	padding: 0 10px;
	border-radius: 12px;
	font-weight: 300;
	font-size: 12px;
}
</style>
