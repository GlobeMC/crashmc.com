import {
  Analyzer,
  Launcher,
  Error,
  Result,
  StatusSuccess,
  StatusUnrecord,
} from "./types"
import loadErrors from "./utils"

function matchLauncher(file: File, ext: string): Launcher {
  var reader = new FileReader()
  if (ext != "zip") {
    try {
      reader.readAsText(file)
      reader.onload = (f) => {
        var text = f.target?.result as string
        for (var l in Launcher) {
          return text.includes(l) ? Launcher[l] : Launcher["Unknown"]
        }
      }
      return Launcher["Unknown"]
    } catch {
      throw "ReadLogErr"
    }
  } else {
    return Launcher["Unknown"]
  }
}

class MCLog {
  content: string
  side: string //TODO: match the game side
  launcher: Launcher
  constructor(file: File, launcher?: Launcher) {
    var reader = new FileReader()
    if (!launcher) {
      this.launcher = matchLauncher(file, "log")
    } else {
      this.launcher = launcher
    }
    try {
      reader.readAsText(file)
      reader.onload = (f) => {
        this.content = f.target?.result as string
      }
    } catch {
      throw "ReadLogErr"
    }
  }
}

class CrashMCAnalyzer implements Analyzer {
  errors: [Error]
  init() {
    loadErrors().then((e) => {
      this.errors = e
    })
  }
  analyze(file: File): Result {
    var reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (f) => {
      for (var error of this.errors) {
        var text = f.target?.result as string
        for (var log of error.log) {
          if (text.includes(log)) {
            return new Result(new StatusSuccess(error))
          } else {
            return new Result(new StatusUnrecord())
          }
        }
      }
    }
    return new Result(new StatusUnrecord())
  }
}

const Analyzer = new CrashMCAnalyzer()

export default { Analyzer }
