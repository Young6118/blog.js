const express = require('express')

const Article = require('../models/article')
const Model = Article
const { log } = require('../utils')
const { jsonResponse } = require('./main')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const router = express.Router()

router.post('/login', (request, response) => {
    const form = request.body
    const obj = Model.fakeCreate(form)
    jsonResponse(request, response, obj)
})

router.get('/all', (request, response) => {
    const ms = Model.all()
    log('debug ms', request.headers)
    const dict = {
        success: true,
        data: ms,
        message: '',
    }
    jsonResponse(request, response, dict)
})

router.get('/detail/:id', (request, response) => {
    const id = Number(request.params.id)
    const m = Model.detail(id)
    const dict = {
        success: true,
        data: m,
        message: '',
    }
    jsonResponse(request, response, dict)
})

router.post('/add', (request, response) => {
    const form = request.body
    console.log('debug body', form)
    const m = Model.create(form)
    const dict = {
        success: true,
        data: m,
        message: '',
    }
    jsonResponse(request, response, dict)
})

module.exports = router

