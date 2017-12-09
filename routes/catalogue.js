const express = require('express')

const Catalogue = require('../models/catalogue')
const Model = Catalogue
const { log } = require('../utils')
const { currentUser, loginRequired, adminRequired } = require('./main')

const main = express.Router()

let tokens = new Set()

main.get('/', adminRequired, async (request, response) => {
    const ms = await Model.all()
    const token = Math.random()
    tokens.add(token)
    const args = {
	    catalogue: ms,
        token: token,
    }
    response.render('catalogue/index.html', args)
})

main.get('/new', adminRequired, (request, response) => {
    response.render('catalogue/new.html')
})

main.post('/add', adminRequired, (request, response) => {
    const form = request.body
    const m = Model.create(form)
    response.redirect('/catalogue')
})

main.get('/delete/:id', adminRequired, (request, response) => {
    const id = Number(request.params.id)
    const token = parseFloat(request.query.token)
	const board = new Catalogue()
	board.id = id
    if (tokens.has(token)) {
        tokens.delete(token)
        const t = Model.remove(board)
        response.redirect('/catalogue')
    } else {
        response.status(403).send('操作是非法的')
    }
})

main.get('/edit/:id', adminRequired, async (request, response) => {
    const id = Number(request.params.id)
    const m = await Model.get(id)
    const args = {
        board: m,
    }
    response.render('catalogue/edit.html', args)
})

main.post('/update', adminRequired, (request, response) => {
    const form = request.body
    const m = Model.update(form)
    response.redirect('/catalogue')
})

module.exports = {
	catalogue: main
}

