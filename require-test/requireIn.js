//异步加载
function readFile(url, callback) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onload = function () {
    callback(xhr.responseText)
  }
  xhr.send()
}
function require(fileName) {
  let code = readFile(fileName)
  let exportss = {}
  let Modfunction = new Function("exportss", code)
  Modfunction(exportss)
  return exportss
}
let a = require('./a.js')