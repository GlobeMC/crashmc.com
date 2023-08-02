<template>
  <component is="script">
    <!-- <script> -->
      function Checkfiles() {
        var fup = document.getElementById('file_uploader');
        var fileName = fup.value;
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        if (ext == "zip" || ext == "log" || ext == "txt") {
          document.getElementById('file_uploader_label').innerText = fileName;
          document.getElementById('file_uploader_btn').innerHTML = "重新上传";
        return true;
        }
        else {
          document.getElementById('file_uploader_label').innerText = "请上传 .zip/.txt/.log 文件!";
        fup.focus();
        return false;
        }
        }
    <!-- </script> -->
  </component>
  <div class="analyzer_main">
    <h4 style="text-align: center;">请点击按钮上传导出的 .zip/.txt/.log 文件</h4>
    <img class="icon_upload" src="../docs/src/logo-upload.svg">
    <div class="file_uploader_container">
      <h4 id="file_uploader_label" for="file_uploader" singleLine="false">未选择文件</h4>
      <button id="file_uploader_btn" onclick="file_uploader.click()">开始上传</button>
      <input type="file" name="file_uploader" id="file_uploader" onchange="Checkfiles()" style="display: none;" />
    </div>
  </div>
</template>

<style scoped>
div {
  height: auto;
  width: auto;
}

.analyzer_main {
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
}
</style>