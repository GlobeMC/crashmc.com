<template>
  <div id="analyzer_main">
    <h4 style="text-align: center;">请点击按钮上传导出的 .zip/.txt/.log 文件,并尽量不要更改导出文件的名称。</h4>
    <img class="icon_upload" src="../docs/src/logo-upload.svg">
    <div class="file_uploader_container">
      <h4 id="file_uploader_label" for="file_uploader" singleLine="false">{{ labelMsg }}</h4>
      <button v-bind:disabled="isBtnDisabled" id="file_uploader_btn" data-umami-event="Analysis Button Click"
        onclick="file_uploader.click()">{{ btnMsg }}</button>
      <input type="file" name="file_uploader" id="file_uploader" @change="Checkfiles" style="display: none;" />
    </div>
  </div>
</template>

<script setup>
import JSZip from 'jszip';
import { ref } from 'vue';

var isBtnDisabled = ref(false);
var labelMsg = ref('未选择文件');
var btnMsg = ref('开始上传');
var launcher = 'Unknown'

function Checkfiles() {
  launcher = 'Unknown'
  var fup = document.getElementById('file_uploader');
  var filePath = fup.value;
  var ext = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
  if (ext == "zip" || ext == "log" || ext == "txt") {
    labelMsg.value = filePath;
    btnMsg.value = "正在分析";
    isBtnDisabled.value = true;
    var file = document.getElementById('file_uploader').files[0]
    StartAnalysis(file, ext);
    return true;
  }
  else {
    document.getElementById('file_uploader_label').innerText = "请上传 .zip/.txt/.log 文件!";
    fup.focus();
    return false;
  }
}
function StartAnalysis(file, ext) {
  var reader = new FileReader(file);
  if (ext != 'zip') {
    try {
      reader.readAsText(file);
      reader.onload = (e) => {
        var logMsg = e.target.result;
        if (logMsg.includes("BakaXL")) {
          launcher = 'BakaXL'
          LogAnalysis(logMsg);
        }
        if (logMsg.includes('Minecraft Crash Report')) {
          launcher = 'Vanilla'
          LogAnalysis(logMsg);
        }
      };
    }
    catch {
      FinishAnalysis('ReadLogErr');
    }
  }
  else {
    try {
      var logZip = new JSZip();
      // more files !
      logZip.loadAsync(file)
        .then(function (zip) {
          var result = zip.file('latest.log');
          if (result == null) {
            FinishAnalysis('CanFetchLogFile', '0')
          }
          else {
            return result.async("string");
          }
        })
        .then(function (content) {
          if (file.name.includes('minecraft-exported-crash-info')) {
            launcher = 'HMCL'
            LogAnalysis(content);
          }
          else if (file.name.includes('错误报告')) {
            launcher = 'PCL'
            LogAnalysis(content);
          }
        })
    }
    catch (error) {
      FinishAnalysis('UnzipErr', error);
    }
  }
}

function LogAnalysis(log) {
  console.warn(launcher);
  console.log(log);
}
function FinishAnalysis(Status, Msg) {
  if (Status == 'CanFetchLogFile') {
    console.error('Zip 文件中不含有 Latest.log');
    umami.track('Analysis Error', { Status: 'Zip 文件中不含有 Latest.log', ErrMsg: Msg });
  }
  else if (Status == 'ReadLogErr') {
    console.error('Log 文件读取错误');
    umami.track('Analysis Error', { Status: 'Log 文件读取错误', ErrMsg: Msg });
  }
  else if (Status == 'UnzipErr') {
    console.error('日志文件解压错误');
    umami.track('Analysis Error', { Status: '日志文件解压错误', ErrMsg: Msg });
  }
  else {
    umami.track('Analysis Finish', { Status: 'Success', Launcher: launcher, CrashReason: 'lorem' });
  }
}
</script>

<style scoped>
div {
  height: auto;
  width: auto;
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

#file_uploader_btn {
  margin-top: 3px;
  height: 35px;
  width: 120px;
  border: 1px solid transparent;
  border-color: var(--vp-custom-block-tip-border);
  background-color: var(--vp-custom-block-tip-bg);
  border-radius: 8px;
  transition: all 0.3s;
}

#file_uploader_btn:hover {
  animation-direction: alternate;
  transform: scale(1.05);
  transition: all 0.3s;
}
</style>