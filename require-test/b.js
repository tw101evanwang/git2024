console.log('b.js 开始')
let c = require('./c.js')
console.log('b.js 拿到了：', c)
module.exports = '我是 b'