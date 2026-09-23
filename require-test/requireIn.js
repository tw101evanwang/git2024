function readFile(url) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url, false)
  xhr.send()
  return xhr.responseText
}
function require(fileName) {
  let code = readFile(fileName)
  let exportss = {}
  let Modfunction = new Function("exportss", code)
  Modfunction(exportss)
  return exportss
}
let a = require('./a.js')