//异步读取文件
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
//执行加载的模块代码
function require(fileName) {
  if (fileName in modCache) {
    return modCache[fileName].exports
  }
  let code = FileCache[fileName]
  let modfunc = new Function('exports', 'module', code)
  let module = {
    id: fileName,
    exports: {},
  }
  modfunc(module.exports, module)
  modCache[fileName] = module//关于循环依赖，可以把缓存模块的代码放到modfunc之前。
  return module.exports
}
function use(fileName) {
  if (fileName in FileCache) {
    require(fileName)//require的时候，文件要已经加载完毕
  } else {
    loadfileAndallDeps(fileName, () => { require(fileName) })
  }
}
function loadfileAndallDeps(fileName, callback) {
  readFile(fileName, (content) => {
    FileCache[fileName] = content
    let getdeps = getdep(content)
    if (getdeps.length === 0) {
      callback()
    } else {
      let count = 0
      getdeps.forEach((element) => {
        loadfileAndallDeps(element, () => {
          count++
          if (count === getdeps.length) {
            callback()
          }
        })
      })
    }
  })
}
function getdep(content) {
  let reg = /require\(\s*(['"])(.+?)\1\s*\)/g
  let deps = []
  let match
  while ((match = reg.exec(content)) !== null) {
    deps.push(match[2])
  }
  return deps
}
//use('./a.js')
function readFilePromise(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
      resolve(xhr.responseText)
    }
    xhr.send()
  })
}
function loadfileAndallDepsPromise(fileName) {
  return readFilePromise(fileName).then((content) => {
    FileCache[fileName] = content
    let getdeps = getdep(content)
    let deps = getdeps.map((element) => {
      return loadfileAndallDepsPromise(element)
    })
    return Promise.all(deps)
  })
}
function usePromise(fileName) {
  if (fileName in FileCache) {
    require(fileName)//require的时候，文件要已经加载完毕
  } else {
    loadfileAndallDepsPromise(fileName).then(() => {
      require(fileName)
    })
  }
}
//usePromise('./a.js')
