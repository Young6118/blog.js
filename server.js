// 引入 http 模块, http 模块是 node 中用来搭建 http 服务器与 http 客户端的
// 我们使用的 express 就是基于这个模块的, 尽管官方认为 node 中 http 的 api 很底层
// 但是实际上 net 是最底层的, http 是在 net 的基础上添加了 http 协议相关的部分
const http = require('http')
const https = require('https')

const express = require('express')
// 引入 url 模块, 方便解析 url
const url = require('url')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')

const app = express()

app.use(bodyParser.json())
// 配置静态资源文件, 比如 js css 图片
const asset = __dirname + '/static'
app.use('/static', express.static(asset))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})

nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})

const log = console.log.bind(console)

const clientByProtocol = (protocol) => {
    if (protocol === 'http:') {
        return http
    } else {
        return https
    }
}

const apiOptions = () => {
    // 从环境变量里获取 api_server 的值, 尽管这个做法不太好
    // (因为环境变量里的值相当于全局变量, 而且是无法控制的全局变量)
    // 但是大家喜欢这样用, 我们也跟着用
    const envServer = process.env.apiServer
    // 设置默认 api 服务器地址
    const defaultServer = 'http://0.0.0.0:4000'
    const server = envServer || defaultServer
    // 解析 url 之后的结果
    const result = url.parse(server)
    // api 形式的请求通常是 Content-Type: application/json
    // 提前设置好这部分
    const obj = {
        headers: {
            'Content-Type': 'application/json',
        },
        // https 相关的设置, 为了方便直接设置为 false 就可以了
        rejectUnauthorized: false,
    }
    const options = Object.assign({}, obj, result)

    if (options.href.length > 0) {
        delete options.href
    }
    return options
}

const httpOptions = (request) => {
    // 先获取基本的 api options 设置
    const baseOptions = apiOptions()
    // 设置请求的 path
    const pathOptions = {
        path: request.originalUrl,
    }
    const options = Object.assign({}, baseOptions, pathOptions)
    // 把浏览器发送的请求的 headers 全部添加到 options 中,
    // 避免出现漏掉某些关键 headers(如 transfer-encoding, connection 等) 导致出 bug 的情况
    Object.keys(request.headers).forEach((k) => {
        options.headers[k] = request.headers[k]
    })
    // 设置请求的方法
    options.method = request.method
    return options
}

app.get('/', (request, response) => {
    response.render('index.html')
})

// 我们理论上只转发 api 请求, 所有符合 /api/* 的请求都会进入这个函数
// GET /api/article/all
// POST /api/article/add
app.all('/api/*', (request, response) => {
    const options = httpOptions(request)
    log('request options', options)
    const client = clientByProtocol(options.protocol)
    // http.request 返回一个请求对象, 这个请求对象会把数据发送到 api server
    const r = client.request(options, (res) => {
        // res.statusCode 是 api server 返回的状态码
        // 保持 express response 的状态码和 api server 的状态码一致
        // 避免出现返回 304, 导致 response 出错
        response.status(res.statusCode)
        log('debug res', res.headers, res.statusCode)
        // 回调里的 res 是 api server 返回的响应
        // 将响应的 headers 原样设置到 response(这个是 express 的 response) 中
        Object.keys(res.headers).forEach((k) => {
            const v = res.headers[k]
            response.setHeader(k, v)
        })

        // 接收 api server 的响应时, 会触发 data 事件, 作业 2 中用到过这个只是
        res.on('data', (data) => {
            // express 的 response 对象是 http 对象的加强版(其实就是我们自己实现的 socket), 可以调用 http 对象的方法
            // write 是 http 对象的方法, 服务器用来发送响应数据的
            log('debug data', data.toString('utf8'))
            response.write(data)
        })

        // api server 的数据接收完成后, 会触发 end 事件
        res.on('end', () => {
            log('debug end')
            // api server 发送完数据之后, express 也告诉客户端发送完数据
            response.end()
        })

        // 响应发送错误
        res.on('error', () => {
            console.error(`error to request: ${request.url}`)
        })
    })

    // 发往 api server 的请求遇到问题
    r.on('error', (error) => {
        console.error(`请求 api server 遇到问题: ${request.url}`, error)
    })

    log('debug options method', options.method)
    if (options.method !== 'GET') {
        // request.body 是浏览器发送过来的数据,
        // 如果不是 GET 方法, 说明 request.body 有内容,
        // 转成 JSON 字符串之后发送到 api server
        const body = JSON.stringify(request.body)
        log('debug body', body, typeof body)
        // 把 body 里的数据发送到 api server
        r.write(body)
    }

    // 结束发送请求
    r.end()
})

// 把逻辑放在单独的函数中, 这样可以方便地调用
// 指定了默认的 host 和 port, 因为用的是默认参数, 当然可以在调用的时候传其他的值
const run = (port=3000, host='') => {
    // app.listen 方法返回一个 http.Server 对象, 这样使用更方便
    // 实际上这个东西的底层是我们以前写的 net.Server 对象
    const server = app.listen(port, host, () => {
        // 非常熟悉的方法
        const address = server.address()
        host = address.address
        port = address.port
        log(`server started at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 3300
    // host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    const host = '0.0.0.0'
    run(port, host)
}