console.log('f.js 开始')
let x = require('./x.js')
let y = require('./y.js')
console.log('f.js 拿到了：', x, y)
module.exports = '我是 f'