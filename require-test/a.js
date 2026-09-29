console.log('a.js 开始')
let b = require('./b.js')
let f = require('./f.js')
console.log('a.js 拿到了：', b, f)
module.exports = '我是 a'