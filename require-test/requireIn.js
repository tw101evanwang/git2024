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
  modCache[fileName] = module//关于循环依赖，可以把缓存模块的代码放到modfunc之前。
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
  readFile(fileName, (content) => {
    FileCache(fileName) = content
  })
  let getdeps = getdep(content)
  function getdep(content) {
    if (getdeps.length === 0) {
      callback()
    } else {
      // //1.基于回调，2.promise,3.async
      // let count = 0
      // getdeps.forEach((element) => {
      //   count++
      //   loadfileAndallDeps(element, () => {
      //     if (count === getdeps.length) {
      //       callback()//全部加载完之后统一回调一次，而不是每次循环都回调一次
      //     }
      //   })
      // });
      let promises = getdeps.map((element) => {
        return loadfileAndallDeps(element)
      })
      Promise.all(promises)
        .then(() => {
          callback()
        })
        .catch(() => {
          console.log(e)
        })
    }
  }
}
function getdep(content) {
  //正则匹配require
}
use('a.js')