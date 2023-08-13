<template>
  <ClientOnly>
    <div
      id="analyzer_main"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @dragleave="handleDragLeave">
      <h4 style="text-align: center">
        请点击按钮上传导出的 .zip/.txt/.log 文件,并尽量不要更改导出文件的名称。
      </h4>
      <img class="icon_upload" src="../../../src/logo-upload.svg" />
      <div class="file_uploader_container">
        <h4 id="file_uploader_label" for="file_uploader" singleLine="false">
          {{ labelMsg }}
        </h4>
        <button
          v-bind:disabled="isBtnDisabled"
          id="file_uploader_btn"
          data-umami-event="Analysis Button Click"
          onclick="file_uploader.click();">
          {{ btnMsg }}
        </button>
        <input
          type="file"
          name="file_uploader"
          id="file_uploader"
          @change="Checkfiles"
          style="display: none" />
      </div>
      <div id="analysis_result_main">
        <hr />
        <h4 id="analysis_result_title">分析结果:</h4>
        <p id="analysis_result_msg">分析器歇逼了</p>
        <button id="redirect_btn" @click="redirectBtnClick">
          {{ redirectMsg }}
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import JSZip from "jszip";
import { ref } from "vue";

// 变量初始化
var isBtnDisabled = ref(false)
var labelMsg = ref("未选择文件")
var btnMsg = ref("开始上传")
var redirectMsg = ref("导航到解决方案")
var launcher = "Unknown"
var redirect_url = null
var increaseOpacTimer = null
var increaseHeightTimer = null

const CUR_URL = window.document.location.href // 当前网址
const ROOT_URL = CUR_URL.substring(
  0,
  CUR_URL.indexOf(window.document.location.pathname),
) // 根网址

const SYSTEM_URL = ROOT_URL + "/client/system.html" // 系统问题
const VANILLA_URL = ROOT_URL + "/client/vanilla.html" // 原版问题
const MODS_URL = ROOT_URL + "/client/mods.html" // Mod 问题

// 阻止浏览器默认拖拽行为
function handleDragEnter(e) {
  document.getElementById("analyzer_main").style.backgroundColor =
    "rgba(255,255,255,0.5)"
  e.preventDefault()
}

// 动画
function handleDragOver(e) {
  document.getElementById("analyzer_main").style.backgroundColor =
    "rgba(255,255,255,0.5)"
  e.preventDefault() // 阻止浏览器默认拖拽行为
}

// 动画
function handleDragLeave(e) {
  document.getElementById("analyzer_main").style.backgroundColor =
    "var(--vp-custom-block-tip-bg)"
}

// 动画
function handleDrop(e) {
  e.preventDefault() // 阻止浏览器默认拖拽行为
  const files = e.dataTransfer.files // 获取拖拽过来的文件
  // 处理文件
  handleFiles(files)
}

/**
 * 拖拽文件处理
 * @param {File} files 拖拽的文件
 */
function handleFiles(files) {
  document.getElementById("analyzer_main").style.backgroundColor =
    "var(--vp-custom-block-tip-bg)"
  Clean()
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
      StartAnalysis(file, ext)
      return true
    } else {
      document.getElementById("file_uploader_label").innerText =
        "请上传 .zip/.txt/.log 文件!"
      return false
    }
  }
}

// 清理 (重新初始化)
function Clean() {
  document.getElementById("analysis_result_main").style.display = "none"
  document.getElementById("analysis_result_main").style.opacity = 0
  document.getElementById("analysis_result_msg").innerText = "分析器歇逼了"
  redirectMsg = ref("导航到解决方案")
  redirect_url = null
  clearInterval(increaseOpacTimer)
  clearInterval(increaseHeightTimer)
}

// 检查文件
function Checkfiles() {
  Clean()
  launcher = "Unknown"
  var fup = document.getElementById("file_uploader")
  var filePath = fup.value
  var ext = filePath.substring(filePath.lastIndexOf(".") + 1).toLowerCase()
  if (ext == "zip" || ext == "log" || ext == "txt") {
    btnMsg.value = "正在分析"
    isBtnDisabled.value = true
    var file = document.getElementById("file_uploader").files[0]
    labelMsg.value = file.name
    StartAnalysis(file, ext)
    return true
  } else {
    document.getElementById("file_uploader_label").innerText =
      "请上传 .zip/.txt/.log 文件!"
    fup.focus()
    return false
  }
}

/**
 * 开始分析文件
 * @param {File} file 文件对象
 * @param {string} ext 文件后缀
 */
function StartAnalysis(file, ext) {
  var reader = new FileReader(file)
  // Log / Txt 文件处理
  if (ext != "zip") {
    try {
      reader.readAsText(file)
      reader.onload = (e) => {
        var logMsg = e.target.result
        LogAnalysis(logMsg)
      }
    } catch {
      // 日志读取错误
      FinishAnalysis("ReadLogErr")
    }
  } else {
    try {
      var jsZip = new JSZip()
      // 从本地或URL加载一个Zip文件
      jsZip
        .loadAsync(file)
        .then(function (zip) {
          // 遍历Zip中的文件对象
          for (let key in zip.files) {
            // 判断是否是文件夹
            if (!zip.files[key].dir) {
              if (
                zip.files[key].name.toLowerCase().includes("pcl") ||
                zip.files[key].name.includes("游戏崩溃前的输出.txt")
              ) {
                launcher = "PCL"
              }
            }
          }
          for (let key in zip.files) {
            // 判断是否是文件夹
            if (!zip.files[key].dir) {
              if (zip.files[key].name.toLowerCase().includes("hmcl")) {
                launcher = "HMCL"
              }
            }
          }
          for (let key in zip.files) {
            if (!zip.files[key].dir) {
              if (zip.files[key].name == "latest.log") {
                return zip.files[key].async("string")
              }
            }
          }
          for (let key in zip.files) {
            if (!zip.files[key].dir) {
              if (zip.files[key].name.search(/crash-(.*).txt/) != -1) {
                return zip.files[key].async("string")
              }
            }
          }
          for (let key in zip.files) {
            if (!zip.files[key].dir) {
              if (
                zip.files[key].name == "minecraft.log" ||
                zip.files[key].name == "游戏崩溃前的输出.txt"
              ) {
                return zip.files[key].async("string")
              } else {
                FinishAnalysis("FetchLogErr", "(＃°Д°)")
                return
              }
            }
          }
        })
        .then(function (content) {
          LogAnalysis(content)
        })
    } catch (error) {
      FinishAnalysis("UnzipErr", error)
    }
  }
}

/**
 * 日志分析 (一堆 if)
 * @param {string} log log 原文
 */
function LogAnalysis(log) {
  //启动器判断 (最准)
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
    ShowAnalysisResult(
      "Success",
      "Java 内存分配不足",
      SYSTEM_URL + "#内存问题",
      "内存不足",
    )

  // 32 位超过 1G
  } else if (
    log.includes("Could not reserve enough space for 1048576KB object heap")
  ) {
    ShowAnalysisResult(
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
    ShowAnalysisResult(
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
    ShowAnalysisResult(
      "Success",
      "使用了 OpenJ9",
      SYSTEM_URL + "#使用-openj9",
      "Used_OpenJ9",
    )

  // .DS_Store
  }  else if (
    log.includes(
        "Caused by: net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:") |
    log.includes("net.minecraft.util.ResourceLocationException: Non [a-z0-9_.-] character in namespace of location: .DS_Store:")
  ) {
    ShowAnalysisResult(
      "Success",
      "存在 .DS_Store 文件导致报错",
      SYSTEM_URL + "#mac-下存在-ds-store-文件导致报错",
      "DS_Store",
    )

  // OpenGL 窗口问题
  } else if (
    log.search(/java.lang.IllegalStateException: GLFW error before init: [*]Cocoa: Failed to find service port for display/)  != -1
  ) {
    ShowAnalysisResult(
      "Success",
      "Mac 下初始化 OpenGL 窗口问题",
      SYSTEM_URL + "#mac-下初始化-opengl-窗口问题",
      "Mac_OpenGL_Init",
    )

  // 页面文件太小
  } else if (
    log.includes("页面文件太小，无法完成操作。")
  ) {
    ShowAnalysisResult(
      "Success",
      "页面文件太小",
      SYSTEM_URL + "#页面文件问题",
      "页面文件太小",
    )

  // 存档损坏
  } else if (
    log.search(/Exception reading [*]\\level.dat/)  != -1 ||
    log.includes("Caused by: java.util.zip.ZipException: invalid distance too far back") ||
    log.includes("net.minecraft.util.crash.CrashException: Loading NBT data")
  ) {
    ShowAnalysisResult(
      "Success",
      "存档损坏",
      VANILLA_URL + "#存档损坏",
      "存档损坏",
    )

  // 资源包过大
  } else if (
    log.includes("Maybe try a lower resolution resourcepack?")
  ) {
    ShowAnalysisResult(
      "Success",
      "资源包过大",
      VANILLA_URL + "#资源包过大",
      "资源包过大",
    )

  // 文件校验失败
  } else if (
    log.includes("signer information does not match signer information of other classes in the same package")
  ) {
    ShowAnalysisResult(
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
    ShowAnalysisResult(
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
    ShowAnalysisResult(
      "Success",
      "Mod 重复安装",
      MODS_URL + "#mod-重复安装",
      "Mod 重复安装",
    )

  // Mod 过多导致超出 ID 限制
  } else if (
    log.includes("maximum id range exceeded")
  ) {
    ShowAnalysisResult(
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
    ShowAnalysisResult(
      "Success",
      "解压了 Mod",
      MODS_URL + "#解压了-mod",
      "解压了 Mod",
    )

  // Mod 名称含有特殊字符
  } else if (
    log.includes("Invalid module name: '' is not a Java identifier")
  ) {
    ShowAnalysisResult(
      "Success",
      "Mod 名称含有特殊字符",
      MODS_URL + "#mod-名称含有特殊字符",
      "Mod 名称含有特殊字符",
    )

  // Mod 文件损坏
  } else if (
    log.includes("Caused by: java.util.zip.ZipException: zip END header not found")
  ) {
    ShowAnalysisResult(
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
    ShowAnalysisResult(
      "Success",
      "一些 Mod 需要访问国外网络",
      MODS_URL + "#一些-mod-需要访问国外网络",
      "一些 Mod 需要访问国外网络",
    )

  // Forge Json 问题
  } else if (
    log.includes("Found multiple arguments for option fml.forgeVersion, but you asked for only one")
  ) {
    ShowAnalysisResult(
      "Success",
      "Forge Json 问题",
      MODS_URL + "#json-问题",
      "Forge Json 问题",
    )

  // Night Config 库问题
  } else if (
    log.includes("forge") && 
    log.includes("Caused by: com.electronwill.nightconfig.core.io.ParsingException: Not enough data available")
  ) {
    ShowAnalysisResult(
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
    ShowAnalysisResult(
      "Success",
      "Forge 缺少前置 Mod",
      MODS_URL + "#缺少前置",
      "Forge 缺少前置 Mod",
    )

  // NeoForge 缺少前置
  } else if (
    log.includes("neoforge") && 
    log.includes("Missing or unsupported mandatory dependencies:")
  ) {
    ShowAnalysisResult(
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
    ShowAnalysisResult(
      "Success",
      "Fabric Mod 版本不兼容",
      MODS_URL + "#版本不兼容",
      "Fabric Mod 版本不兼容",
    )

  // Fabric Mod 缺少前置
  } else if (
    log.includes("fabric") && 
    log.includes("Unmet dependency listing:")
  ) {
    ShowAnalysisResult(
      "Success",
      "Fabric Mod 缺少前置",
      MODS_URL + "#缺少前置-2",
      "Fabric Mod 缺少前置",
    )

  // Fabric Mod 冲突
  } else if (
    log.includes("net.fabricmc.loader.impl.FormattedException: Mod resolution encountered an incompatible mod set!") || 
    log.includes("that is compatible with")
  ) {
    ShowAnalysisResult(
      "Success",
      "Fabric Mod 冲突",
      MODS_URL + "#mod-冲突",
      "Fabric Mod 冲突",
    )

  // Quilt Mod 缺少前置
  } else if (
    log.includes("quilt") && 
    log.includes("which is missing!")
  ) {
    ShowAnalysisResult(
      "Success",
      "Quilt Mod 缺少前置",
      MODS_URL + "#缺少前置-3",
      "Quilt Mod 缺少前置",
    )

  // OptiFine 无法加载世界
  } else if (
    log.includes("java.lang.NoSuchMethodError: net.minecraft.world.server.ChunkManager$ProxyTicketManager.shouldForceTicks(J)Z")
  ) {
    ShowAnalysisResult(
      "Success",
      "OptiFine 导致无法加载世界",
      MODS_URL + "#无法加载世界",
      "OptiFine 导致无法加载世界",
    )

  // Forge 与 OptiFine 兼容性问题导致的崩溃
  } else if (
    log.includes("java.lang.NoSuchMethodError: 'java.lang.Class sun.misc.Unsafe.defineAnonymousClass(java.lang.Class, byte[], java.lang.Object[])'") || 
    log.includes("java.lang.NoSuchMethodError: 'java.lang.String com.mojang.blaze3d.systems.RenderSystem.getBackendDescription()'") || 
    log.includes("java.lang.NoSuchMethodError: 'net.minecraft.network.chat.FormattedText net.minecraft.client.gui.Font.ellipsize(net.minecraft.network.chat.FormattedText, int)'") || 
    log.includes("java.lang.NoSuchMethodError: 'void net.minecraft.server.level.DistanceManager") || 
    log.includes("java.lang.NoSuchMethodError: 'void net.minecraft.client.renderer.block.model.BakedQuad.<init>(int[], int, net.minecraft.core.Direction, net.minecraft.client.renderer.texture.TextureAtlasSprite, boolean, boolean)'") || 
    log.includes("java.lang.NoSuchMethodError: 'void net.minecraft.client.renderer.texture.SpriteContents.<init>(net.minecraft.resources.ResourceLocation") || 
    log.includes("java.lang.NoSuchMethodError: 'void net.minecraft.server.level.DistanceManager.addRegionTicket(net.minecraft.server.level.TicketType, net.minecraft.world.level.ChunkPos, int, java.lang.Object, boolean)'") || 
    log.includes("java.lang.NoSuchMethodError: net.minecraft.launchwrapper.ITweaker.injectIntoClassLoader(Lnet/minecraft/launchwrapper/LaunchClassLoader;)V") || 
    log.includes("TRANSFORMER/net.optifine/net.optifine.reflect.Reflector.<clinit>(Reflector.java")
  ) {
    ShowAnalysisResult(
      "Success",
      "Forge 与 OptiFine 兼容性问题导致的崩溃",
      MODS_URL + "#forge-与-optifine-兼容性问题导致的崩溃",
      "Forge 与 OptiFine 兼容性问题导致的崩溃",
    )

  // 以上都无
  } else {
    ShowAnalysisResult(
      "Unrecord",
      "本工具还未收录您所遇到的错误，请点击下方按钮前往 GitHub 反馈。",
      "https://github.com/GlobeMC/crashmc.com/issues/new/choose",
      "Unrecord",
    )
  }
}

/**
 * 展示分析结果
 * @param {string} status 状态消息
 * @param {string} msg 向用户展示的消息
 * @param {string} result_url 重定向 url
 * @param {string} status_msg 状态信息
 */
function ShowAnalysisResult(status, msg, result_url, status_msg) {
  //信息更改
  redirect_url = result_url
  document.getElementById("analysis_result_main").style.display = "block"
  document.getElementById("analysis_result_msg").innerText = msg

  //展开动画
  var count = 0
  var con = document.getElementById("analysis_result_main")
  var conHeight = con.offsetHeight
  var h = 0
  clearInterval(increaseHeightTimer)
  increaseHeightTimer = setInterval(function () {
    count += 1
    h += 2 + count
    if (h >= conHeight) {
      h = conHeight
      clearInterval(increaseHeightTimer)
    }
    con.style.height = h + "px"
  }, 10)

  //透明度动画 (延迟)
  setTimeout(function () {
    var alpha = 30
    var oDiv = document.getElementById("analysis_result_main") //关闭定时器
    increaseOpacTimer = setInterval(function () {
      //打开另一个计时器
      var speed = 0
      if (alpha > oDiv) {
        speed = -10 //设置变化的速度
      } else {
        speed = 10
      }
      if (alpha == oDiv) {
        clearInterval(increaseOpacTimer) //相等的时候关闭计时器
      } else {
        alpha += speed //透明度不断减小
        oDiv.style.filter = "alpha(opacity:" + alpha + ")" //IE
        oDiv.style.opacity = alpha / 100 //火狐，chrome
      } //改变透明度
    }, 40)
  }, 300)

  // 消息更改
  isBtnDisabled.value = false
  btnMsg.value = "重新上传"

  //结束分析
  FinishAnalysis(status, status_msg)
}

/**
 * 结束分析
 * @param {string} status 分析状态
 * @param {string} msg 传递信息
 */
function FinishAnalysis(status, msg) {
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
 * 重定向按钮
 */
function redirectBtnClick() {
  if (
    redirect_url == "https://github.com/GlobeMC/crashmc.com/issues/new/choose"
  ) {
    window.open(redirect_url)
  } else if (redirect_url == null || redirect_url == undefined) {
    labelMsg.value = "无法重定向到解决方案页面"
    FinishAnalysis("ErrOpenRstPage", redirect_url)
  } else {
    window.location.href = redirect_url
  }
}
</script>

<style scoped>
div {
  height: 100%;
  width: 100%;
}

p {
  margin: 0;
  padding: 0;
}

#analysis_result_main {
  display: none;
  opacity: 0;
}

#analysis_result_title {
  margin-top: 10px;
}

#analyzer_main {
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

#analysis_result_main {
  text-align: center;
  margin: auto;
  width: 100%;
  height: 100%;
}

.icon_upload {
  margin: auto;
  height: 20%;
  width: 20%;
}

.file_uploader_container {
  text-align: center;
  margin: auto;
  width: 100%;
  height: 100%;
}

button {
  margin-top: 3px;
  height: 35px;
  width: 120px;
  border: 1px solid transparent;
  border-color: var(--vp-custom-block-tip-border);
  background-color: var(--vp-custom-block-tip-bg);
  border-radius: 8px;
  transition: all 0.3s;
}

button:hover {
  animation-direction: alternate;
  transform: scale(1.05);
  transition: all 0.3s;
}
</style>
