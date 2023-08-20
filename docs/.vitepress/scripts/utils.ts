import { Error } from "./types"

/**
 * 根据指定的 zip 文件与索引，读取文件的全部内容。
 * @param {zip} zip zip 文件。
 * @param {int} key 索引。
 */
async function GetLog(zip, key) {
  return await zip.files[key].async("string")
}

async function loadErrors(): Promise<[Error]> {
  var url = "https://blog.booling.cn/files/errors.json" //TODO: use crashmc link here
  var res = await fetch(url)
  var text = await res.text()
  return JSON.parse(text) as [Error]
}

export default loadErrors
