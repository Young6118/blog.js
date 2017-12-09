const express = require('express')

const Article = require('../models/article')
const Catalogue = require('../models/catalogue')
const Model = Article
const { log } = require('../utils')
const { currentUser, adminRequired } = require('./main')

const admin = express.Router()

admin.get('/', async (request, response) => {
	const board_id = Number(request.query.board_id || -1)
	let ms = await Article.allList(board_id)
	const catalogue = await Catalogue.all()
	for (i in ms) {
		ms[i].replies =  await Article.replies(ms[i].id)
	}
	const args = {
		article: ms,
		catalogue: catalogue,
		board_id: board_id,
	}
	response.render('admin/index.html', args)
})

admin.get('/deleteUser', async (request, response) => {
	const id = Number(request.params.id)
	const m = await Article.get(id)

	m.replies = await Article.replies(id)
	const User = require('../models/user.js')
	for (i in m.replies) {
		let user = await User.get(m.replies[0].user_id)
		m.replies[i].id = user.id
		m.replies[i].username = user.username
		m.replies[i].avatar = user.avatar
	}
	m.author = await User.get(m.user_id)
	m.content = md.render(m.content)
	const args = {
		article: m,
	}
	response.render('article/detail.html', args)
})

admin.get('/updateUser', adminRequired, async (request, response) => {
	const catalogue = await Catalogue.all()
	const args = {
		catalogue: catalogue,
	}
	response.render('article/new.html', args)
})

admin.get('/addUser', adminRequired, async (request, response) => {
	const form = request.body
	const u = await currentUser(request)
	form.user_id = u.id
	const m = await Model.create(form)
	response.redirect('/article')
})

admin.get('/deleteArticle', adminRequired, async (request, response) => {
	const id = Number(request.params.id)
	const t = await Model.remove(id)
	response.redirect('/todo')
})

admin.get('/updateArticle', adminRequired, async (request, response) => {
	const id = Number(request.params.id)
	const m = await Model.get(id)
	const args = {
		article: m,
	}
	response.render('todo/edit.html', args)
})

module.exports = admin

