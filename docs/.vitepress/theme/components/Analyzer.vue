<script setup>
import JSZip from "jszip"
import { useRouter } from "vitepress"
import { ref, onBeforeMount, onUnmounted } from "vue"
import axios from "axios"

//@global_define MCLA = undefined
const GO_WASM_EXEC_URL = "https://kmcsr.github.io/mcla/wasm_exec.js"
const MCLA_WASM_URL = "https://kmcsr.github.io/mcla/mcla.wasm"
const MCLA_GH_DB_PREFIX = "https://raw.githubusercontent.com/kmcsr/mcla-db-dev/main"

const router = useRouter()

// 元素引用
const fileUploader = ref(null)

// 变量初始化
const analyzerBackgroundColor = ref("")

const analysisShowResult = ref(false)
const isBtnDisabled = ref(false)
const labelMsg = ref("未选择文件")
const btnMsg = ref("开始上传")
const analysisResultMsg = ref("")
const redirectMsg = ref("导航到解决方案")
var launcher = "Unknown"
var redirect_url = null
var increaseOpacTimer = null
var increaseHeightTimer = null

const SYSTEM_URL = "/client/system.html" // 系统问题
const VANILLA_URL = "/client/vanilla.html" // 原版问题
const MODS_URL = "/client/mods.html" // Mod 问题
const MIXIN_URL = "/mixin.html" // Mod 问题

async function loadMCLA(){
  await import(GO_WASM_EXEC_URL) // set variable `window.Go``
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
}

function unloadMCLA(){
  if(window.MCLA && MCLA.release){
    MCLA.release()
  }
}

// 阻止浏览器默认拖拽行为
function handleDragEnter(e) {
  analyzerBackgroundColor.value = "rgba(255,255,255,0.5)"
}

// 动画
function handleDragOver(e) {
  analyzerBackgroundColor.value = "rgba(255,255,255,0.5)"
}

// 动画
function handleDragLeave(e) {
  analyzerBackgroundColor.value = "var(--vp-custom-block-tip-bg)"
}

// 动画
function handleDrop(e) {
  const files = e.dataTransfer.files // 获取拖拽过来的文件
  // 处理文件
  handleFiles(files)
}

/**
 * 拖拽文件处理。
 * @param {File} files 拖拽的文件。
 */
function handleFiles(files) {
  console.log("文件拖拽：" + files)
  analyzerBackgroundColor.value = "var(--vp-custom-block-tip-bg)"
  clean() // 重新初始化
  if (files.length != 1) {
    labelMsg.value = "仅能上传一个文件"
  } else {
    launcher = "Unknown"
    var file = files[0]
    var filePath = files[0].name
    var ext = filePath.substring(filePath.lastIndexOf(".") + 1).toLowerCase()
    if (ext == "zip" || ext == "log" || ext == "txt") {
      btnMsg.value = "正在分析"
      isBtnDisabled.value = true
      labelMsg.value = file.name
      startAnalysis(file, ext)
      return true
    } else {
      labelMsg.value = "请上传 .zip/.txt/.log 文件!"
      return false
    }
  }
}

/**
 * 重新初始化。
 */
function clean() {
  console.log("重新初始化")
  analysisShowResult.value = false
  analysisResultMsg.value = "分析器歇逼了"
  redirectMsg.value = "导航到解决方案"
  redirect_url = null
  clearInterval(increaseOpacTimer)
  clearInterval(increaseHeightTimer)
}

/**
 * 分析文件。可以分析返回 true，不能分析返回 false。
 */
function checkfiles() {
  clean()
  launcher = "Unknown"
  var fup = fileUploader.value
  var filePath = fup.value
  var ext = filePath.substring(filePath.lastIndexOf(".") + 1).toLowerCase()
  if (["zip", "log", "txt"].includes(ext)) {
    console.log("分析文件：" + ext)
    btnMsg.value = "正在分析"
    isBtnDisabled.value = true
    var file = fileUploader.value.files[0]
    labelMsg.value = file.name
    startAnalysis(file, ext)
    return true
  } else {
    labelMsg.value = "请上传 .zip/.txt/.log 文件!"
    fup.focus()
    return false
  }
}

/**
 * 开始分析文件
 * @param {File} file 文件对象
 * @param {string} ext 文件后缀
 */
function startAnalysis(file, ext) {
  var reader = new FileReader(file)

  if (ext != "zip") { // Log / Txt 文件处理
    try {
      reader.readAsText(file)
      reader.onload = (e) => {
        var logMsg = e.target.result
        logAnalysis(logMsg)
      }
    } catch {
      // 日志读取错误
      finishAnalysis("ReadLogErr")
    }
  } else {
    try {
      var jsZip = new JSZip()
      // 从本地或 URL 加载一个 Zip 文件
      jsZip
        .loadAsync(file)
        .then(async (zip) => { // 由 jsZip 库传递 zip 文件
          // 启动器分析
          // 遍历 Zip 中的文件对象
          for (let file of zip.files) {
            if (!file.dir) { // 不是文件夹，则进行分析
              if (
                file.name.toLowerCase().includes("pcl") || // PCL 启动器日志.txt
                file.name.includes("游戏崩溃前的输出.txt")
              ) {
                console.log("已确定启动器类型为：PCL")
                launcher = "PCL"
              }
            }
          }
          for (let file of zip.files) {
            if (!file.dir) { // 不是文件夹，则进行分析
              if (file.name.toLowerCase().includes("hmcl")) { // hmcl.log
                console.log("已确定启动器类型为：HMCL")
                launcher = "HMCL"
              }
            }
          }

          // 日志读取
          console.log("开始获取日志文件")
          var logText = ""
          for (let file of zip.files) {
            if (!file.dir) { // 不是文件夹，则进行读取
              if (
                file.name == "latest.log" ||                 // latest.log
                file.name == "debug.log" ||                  // debug.log
                file.name.search(/crash-(.*).txt/) != -1 ||  // crash-***.txt
                file.name == "minecraft.log" ||              // minecraft.log
                file.name == "游戏崩溃前的输出.txt"            // 游戏崩溃前的输出.txt（仅 PCL）
              ) {
                logText += await file.async("string") + "\n"
                console.log("已读取的文件：" + zip.files[key].name)
              } else {
                console.log("未读取的文件：" + zip.files[key].name)
              }
            }
          }
          if (logText === "") { // 啥都没读到
            console.log("日志获取完成，没有获取到可用日志")
            finishAnalysis("FetchLogErr", "(＃°Д°)")
            throw "No logs avaliable"
          }
          // 读到日志了，贼棒
          console.log("日志获取完成，长度为：" + logText.length + " 字符")
          return logText
        })
        .then(logAnalysis)
    } catch (error) {
      finishAnalysis("UnzipErr", error)
    }
  }
}

/**
 * 分析日志，并展示分析结果。
 * @param {string} log Log 原文。
 */
async function logAnalysis(log) {
  console.log("开始分析日志")
  // 启动器判断 (最准)
  if (log.includes("PCL")) {
    launcher = "PCL"
  } else if (log.includes("HMCL")) {
    launcher = "HMCL"
  } else if (log.includes("BakaXL")) {
    launcher = "BakaXL"
  }

  // 错误判断

  var errors = await MCLA.analyzeLogErrors(log)
  console.debug('MCLA.analyzeLogErrors result:', errors)
  if(errors && errors.length > 0){
    // TODO: show all parsed errors
    let res = errors[errors.length - 1]
    if(res.solutions.length > 0){
      // TODO: show multiple matched errors
      let solsMatch = res.solutions[0]
      // TODO: show multiple solutions
      let solIds = solsMatch.solutions
      let solId = solIds[0]
      const sol = (await axios.get(`${MCLA_GH_DB_PREFIX}/solutions/${solId}.json`)).data
      showAnalysisResult(
        "Success",
        sol.description,
        sol.link_to,
      )
      return
    }
  }
  // 32 位超过 1G
  if (
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
    log.includes("Couldn't set pixel format") |
    log.includes("Pixel format not accelerated") |
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
    log.includes("Open J9 is not supported") |
    log.includes("OpenJ9 is incompatible") |
    log.includes(".J9VMInternals.")
  ) {
    showAnalysisResult(
      "Success",
      "使用了 OpenJ9",
      SYSTEM_URL + "#使用-openj9",
      "Used_OpenJ9",
    )

  // 页面文件太小
  } else if (
    log.includes("页面文件太小，无法完成操作。")
  ) {
    showAnalysisResult(
      "Success",
      "页面文件太小",
      SYSTEM_URL + "#页面文件问题",
      "页面文件太小",
    )

  // 资源包过大
  } else if (
    log.includes("Maybe try a lower resolution resourcepack?")
  ) {
    showAnalysisResult(
      "Success",
      "资源包过大",
      VANILLA_URL + "#资源包过大",
      "资源包过大",
    )

  // 文件校验失败
  } else if (
    log.includes("signer information does not match signer information of other classes in the same package")
  ) {
    showAnalysisResult(
      "Success",
      "文件校验失败",
      VANILLA_URL + "#文件校验失败",
      "文件校验失败",
    )

  // Mod 过多导致超出 ID 限制
  } else if (
    log.includes("maximum id range exceeded")
  ) {
    showAnalysisResult(
      "Success",
      "Mod 过多导致超出 ID 限制",
      MODS_URL + "#mod-过多导致超出-id-限制",
      "Mod 过多导致超出 ID 限制",
    )

  // 解压了 Mod
  } else if (
    log.includes("The directories below appear to be extracted jar files. Fix this before you continue.") || 
    log.includes("Extracted mod jars found, loading will NOT continue")
  ) {
    showAnalysisResult(
      "Success",
      "解压了 Mod",
      MODS_URL + "#解压了-mod",
      "解压了 Mod",
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
    log.includes("Found multiple arguments for option fml.forgeVersion, but you asked for only one")
  ) {
    showAnalysisResult(
      "Success",
      "Forge Json 问题",
      MODS_URL + "#json-问题",
      "Forge Json 问题",
    )

  // Forge 缺少前置
  } else if (
    log.includes("forge") && 
    log.includes("Missing or unsupported mandatory dependencies:") && 
    log.includes("neoforge") == false
  ) {
    var missingMod = new Array()
    // 按行分割日志
    var spilted = log.split("\n")
    // 获取缺少的 Mod 信息
    for (let key in spilted) {
        if (spilted[key].includes("Mod ID: ") |
        spilted[key].includes(", Requested by: ")
        ) {
            // 正则匹配单引号内内容
            matches = spilted[key].match(/'([^']+)'/g)
            missingMod.push(
                matches[0].replace(/'/g, "") + " " + // Mod 名称，例如 'oculus'
                matches[2].replace(/'/g, "").replace(/\$\{minecraft_version\}/g, "MinecraftVersion") // Mod 版本，例如 '[1.4,)'，之后可以把最低 / 最高版本提取出来解析一遍
            )
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

  // Quilt Mod 缺少前置
  } else if (
    log.includes("quilt") && 
    log.includes("which is missing!")
  ) {
    showAnalysisResult(
      "Success",
      "Quilt Mod 缺少前置",
      MODS_URL + "#缺少前置-3",
      "Quilt Mod 缺少前置",
    )

  // Mixin 注入失败
  } else if (
    log.includes("Mixin apply for mod") && 
    log.includes("failed")
  ) {
    showAnalysisResult(
      "Success",
      "Mixin 注入失败",
      MIXIN_URL + "#mixin-注入失败",
      "Mixin 注入失败",
    )

  // 以上都无
  } else {
    console.log("日志分析结束，没有找到可能的原因")
    showAnalysisResult(
      "Unrecord",
      "本工具还未收录您所遇到的错误，请点击下方按钮前往 GitHub 反馈。",
      "https://github.com/GlobeMC/crashmc.com/issues/new/choose",
      "Unrecord",
    )
  }
}

/**
 * 展示分析结果。
 * @param {string} status 状态消息。
 * @param {string} msg 向用户展示的消息。
 * @param {string} result_url 重定向 Url。
 * @param {string} status_msg 状态信息。
 */
function showAnalysisResult(status, msg, result_url, status_msg) {
  console.log("展示分析结果：(" + status + ") " + msg)
  // 信息更改
  redirect_url = result_url
  analysisResultMsg.value = msg
  analysisShowResult.value = true

  // 消息更改
  isBtnDisabled.value = false
  btnMsg.value = "重新上传"

  // 结束分析
  finishAnalysis(status, status_msg)
}

/**
 * 结束分析。
 * @param {string} status 分析状态。
 * @param {string} msg 传递信息。
 */
function finishAnalysis(status, msg) {
  console.log("结束分析：(" + status + ") " + msg)
  switch (status) {
    case "FetchLogErr":
      labelMsg.value = "Zip 文件中不含有有效的 Log 文件"
      btnMsg.value = "重新上传"
      isBtnDisabled = false
      umami.track("Analysis Error", {
        Status: "No_Log_File_In_Zip",
        ErrMsg: msg,
      })
      break

    case "ReadLogErr":
      labelMsg.value = "Log 文件读取错误"
      btnMsg.value = "重新上传"
      isBtnDisabled = false
      umami.track("Analysis Error", {
        Status: "Cannot_Read_Log_File",
        ErrMsg: msg,
      })
      break

    case "UnzipErr":
      labelMsg.value = "日志文件解压错误"
      btnMsg.value = "重新上传"
      isBtnDisabled = false
      umami.track("Analysis Error", {
        Status: "Cannot_Unzip_Log_File",
        ErrMsg: msg,
      })
      break
    case "ErrOpenRstPage":
      umami.track("Analysis Error", {
        Status: "Cannot_Redirect_To_Resolution",
        Launcher: launcher,
      })
      break
    case "Unrecord":
      umami.track("Unrecord Crash", {
        Status: "Unrecord_Crash",
        Launcher: launcher,
      })
      redirectMsg.value = "提交反馈"
    case "Success":
      umami.track("Analysis Finish", {
        Status: "Analysis_Success",
        Launcher: launcher,
        CrashReason: msg,
      })
      break
    default:
      umami.track("Analysis Error", {
        Status: "Unknown_Error",
        Launcher: launcher,
      })
      break
  }
}

/**
 * 重定向按钮。
 */
function redirectBtnClick() {
  if (redirect_url.startsWith('/')) {
    router.go(redirect_url)
  } else if (typeof redirect_url === 'string') {
    window.open(redirect_url)
  } else {
    labelMsg.value = "无法重定向到解决方案页面"
    finishAnalysis("ErrOpenRstPage", redirect_url)
  }
}

onBeforeMount(async () => {
  await loadMCLA()
})

onUnmounted(() => {
  unloadMCLA()
})

</script>

<template>
  <ClientOnly>
    <div
      class="analyzer-main"
      :style="{'background-color': analyzerBackgroundColor}"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @drop.prevent="handleDrop"
      @dragleave.prevent="handleDragLeave">
      <h4 style="text-align: center">
        请点击按钮上传导出的 .zip/.txt/.log 文件, 并尽量不要更改导出文件的名称。
      </h4>
      <img class="icon-upload" src="../../../src/logo-upload.svg" />
      <div class="file-uploader-container">
        <h4 class="file-uploader-label" for="file-uploader" singleLine="false">
          {{ labelMsg }}
        </h4>
        <button
          :disabled="isBtnDisabled"
          class="button file-uploader-btn"
          data-umami-event="Analysis Button Click"
          @click="fileUploader.click()">
          {{ btnMsg }}
        </button>
        <input
          ref="fileUploader"
          type="file"
          name="file_uploader"
          id="file-uploader"
          @change="checkfiles"
          style="display: none" />
      </div>
      <Transition name="analysis-result">
        <div v-if="analysisShowResult" class="analysis-result-main">
          <hr />
          <h4 class="analysis-result-title">分析结果:</h4>
          <p class="analysis-result-msg">{{analysisResultMsg}}</p>
          <button class="button" @click="redirectBtnClick">
            {{ redirectMsg }}
          </button>
        </div>
      </Transition>
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

.analysis-result-title {
  margin-top: 10px;
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
  text-align: center;
  margin: auto;
  width: 100%;
  height: 100%;
  max-height: 8rem;
  overflow: hidden;
}

.analysis-result-enter-active,
.analysis-result-leave-active {
  transition: all 0.6s;
}

.analysis-result-enter-from,
.analysis-result-leave-to {
  max-height: 0 !important;
  opacity: 0;
}

.icon-upload {
  margin: auto;
  height: 20%;
  width: 20%;
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
  transition: all 0.3s;
}

.button:hover {
  animation-direction: alternate;
  transform: scale(1.05);
  transition: all 0.3s;
}

</style>