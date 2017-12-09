const express = require('express')

const User = require('../models/user')
const { log } = require('../utils')
const { currentUser } = require('./main')

const index = express.Router()

const isEmptyObject = (e) => {
	var t;
	for (t in e)
		return !1;
	return !0
}

index.get('/', async (request, response) => {
    const u = await currentUser(request)
    const args = {
        user: u,
    }
    response.render('index/index.html', args)
})

index.get('/login', (request, response) => {
    const args = {
        next_url: request.query.next_url || ''
    }
    response.render('index/login.html', args)
})

index.post('/login', async (request, response) => {
    const form = request.body
    const u = await User.findOne({'username': form.username})
	let fullObj = !isEmptyObject(u)
	let access = fullObj ? (await u.validateAuth(form)) : false
	if(access) {
		request.session.uid = u.id
		const nextUrl = form.next_url || '/'
		response.redirect(nextUrl)
	} else {
		response.send('账号或密码错误，请重试！<script>window.location.href = "/"</script>')
	}
})

index.get('/register', (request, response) => {
    response.render('index/register.html')
})

index.post('/register', async (request, response) => {
    const form = request.body
	console.log(form)
    const u = await User.register(form)
	if(isEmptyObject(u)) {
		response.send('账号或密码不合法，请重试！<script>window.location.href = "/"</script>')
	} else {
		response.redirect('/')
	}
})

index.get('/logout', (request, response) => {
    request.session = null
    response.redirect('/')
})

module.exports = index

