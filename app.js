const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const cors = require('cors')

const { log } = require('./utils')
const { secretKey } = require('./config')

const { catalogue } = require('./routes/catalogue')
const { user } = require('./routes/user')
const article = require('./routes/article')
const index = require('./routes/index')
const reply = require('./routes/reply')

const apiArticle = require('./api/catalogue')
const { apiFile } = require('./api/fileApi')

const asset = __dirname + '/static'
const app = express()

const env = nunjucks.configure('templates', {
	autoescape: true,
	express: app,
	noCache: true,
})

env.addFilter('formattedTime', (ts) => {
	const formattedTime = require('./filter/formattedTime')
	const s = formattedTime(ts)
	return s
})


app.use(cors())

app.use(bodyParser.urlencoded({
    extended: false,
}))
app.use(bodyParser.json())
app.use(session({
    secret: secretKey,
}))

app.use('/static', express.static(asset))

app.use((request, response, next) => {
    response.locals.flash = request.session.flash
    delete request.session.flash
    next()
})


app.use('/', index)
app.use('/article', article)
app.use('/reply', reply)
app.use('/catalogue', catalogue)
app.use('/user', user)

app.use('/api/article', apiArticle)
app.use('/api/file', apiFile)

app.use((request, response) => {
    response.status(404)
    response.render('404.html')
})

app.use((error, request, response) => {
    console.error(error.stack)
    response.status(500)
    response.send('定制的 500 错误')
})

const run = (port=8081, host='') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`ok http://${host}:${port}`)
        console.log('listening server at http://' + host + ':' + port)
    })
}


// unit test
if (require.main === module) {
    const port = 8081
    const host = '0.0.0.0'
    run(port, host)
}
