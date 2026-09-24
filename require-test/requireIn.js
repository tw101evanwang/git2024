//异步加载
function readFile(url, callback) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onload = function () {
    callback(xhr.responseText)
  }
  xhr.send()
}
let FileCache = Object.create(null)
let modCache = Object.create(null)
function require(fileName) {
  let code = FileCache[fileName]
  let modfunc = new Function('exports, module', code)
  let module = {
    id: fileName,
    exportss: {},
  }
  modfunc('exports, module', module)
  modCache[fileName] = module
  return module.exportss
}
function use(fileName) {
  if (fileName in FileCache) {
    require(fileName)//require的时候，文件已经加载完毕
  } else {
    loadfileAndallDeps(fileName).then(() => { require(fileName) })
  }
}
function loadfileAndallDeps(fileName, callback) {
//1.基于回调，2.promise,3.async
  readFile(fileName, (content) => {
    FileCache(fileName) = content
  })
  let getdeps = getdep(content)
  function getdep(content) {
    if (getdeps.length === 0) {
      callback()
    } else {
      let count = 0
      getdeps.forEach((element) => {
        count++
        loadfileAndallDeps(element, () => {
          if (count === getdeps.length) {
            callback()
          }
        })
      });
    }
  }
}
function getdep(content) {
  //正则匹配require
}
use('a.js')