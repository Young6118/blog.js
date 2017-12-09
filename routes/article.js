const express = require('express')

const Article = require('../models/article')
const Catalogue = require('../models/catalogue')
const Model = Article
const { log } = require('../utils')
const { currentUser, loginRequired, adminRequired } = require('./main')

const hljs = require('highlight.js')
const md = require('markdown-it')({
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}

		return ''
	}
})

const article = express.Router()


article.get('/', async (request, response) => {
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
    response.render('article/index.html', args)
})

article.get('/detail/:id', async (request, response) => {
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
	m.catalogue = await Catalogue.get(m.board_id)
    const args = {
	    article: m,
    }
    response.render('article/detail.html', args)
})

article.get('/new', adminRequired, async (request, response) => {
    const catalogue = await Catalogue.all()
    const args = {
        catalogue: catalogue,
    }
    response.render('article/new.html', args)
})

article.post('/add', adminRequired, async (request, response) => {
    const form = request.body
    const u = await currentUser(request)
    form.user_id = u.id
    const m = await Model.create(form)
    response.redirect('/article')
})

article.get('/delete/:id', adminRequired, async (request, response) => {
    const id = Number(request.params.id)
    const t = await Model.remove(id)
    response.redirect('/todo')
})

article.get('/edit/:id', adminRequired, async (request, response) => {
    const id = Number(request.params.id)
    const m = await Model.get(id)
    const args = {
	    article: m,
    }
    response.render('todo/edit.html', args)
})

article.post('/update', adminRequired, async (request, response) => {
    const form = request.body
    const m = await Model.update(form)
    response.redirect('/todo')
})

module.exports = article

