interface Analyzer {
  init()
  analyze(file: File): Result
}

enum Launcher {
  HMCL = "HMCL",
  BakaXL = "BakaXL",
  PCL = "PCL",
  Unknown = "Unknown",
}

/**
 * 分析结果。
 * @param {string} status 状态消息。
 * @param {string} msg 向用户展示的消息。
 * @param {string} result_url 重定向 Url。
 * @param {string} status_msg 状态信息。
 */
class Result {
  status: ResultStatus
  details: string
  msg: string
  result_url: string
  status_msg: string
  constructor(status: ResultStatus) {
    this.status = status
  }
}

abstract class ResultStatus {
  type: string
  label_msg: string
  btn_msg: string
  need_btn_disabled: boolean
  abstract track()
}

class StatusSuccess extends ResultStatus {
  error: Error
  track() {
    //TODO: umami track here
  }
  constructor(err: Error) {
    super()
    this.type = "Success"
    this.error = err
  }
}

class StatusUnrecord extends ResultStatus {
  track() {
    //TODO: umami track here
  }
  constructor() {
    super()
    this.type = "Unrecord"
  }
}

class Error {
  name: string
  log: [string]
  msg: string
  result_msg: string
  status_msg: string
}

export { StatusSuccess, StatusUnrecord }
export { Analyzer, Launcher, Error, Result }
