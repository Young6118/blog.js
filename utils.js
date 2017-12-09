const fs = require('fs')

// 格式化时间的函数
const formattedTime = () => {
    const d = new Date()
    // 这里需要注意, js 中 month 是从 0 开始计算的, 所以要加 1
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()

    const t = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`
    return t
}

const log = (...args) => {
    const t = formattedTime()
    const arg = [t].concat(args)

    // log 出来的结果写入到文件中
    const content = arg + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a',
    })
}

module.exports = {
    log: log,
}