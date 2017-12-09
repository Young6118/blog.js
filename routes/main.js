const User = require('../models/user')

const { log } = require('../utils')

const currentUser = async (request) => {
    // 通过 session 获取 uid, 如果没有的话就设置成空字符串
    const uid = request.session.uid || ''
    const u = await User.findOne({id: uid})
    if (u === null) {
        const fakeUser = {
            id: -1,
            username: '游客',
            isAdmin: function() {
                return false
            }
        }
        return fakeUser
    } else {
        return u
    }
}

const loginRequired = async (request, response, next) => {
    const u = await currentUser(request)
    if (u.id === -1) {
        log('登录检测: 未登录', request.method)
        const baseUrl = '/login'
        if (request.method === 'GET') {
            response.redirect(baseUrl)
        } else {
            // 应该用一个函数来生成 url, 这里的写法实际上并不好, 因为以后可能还会添加相关的数据
            const nextUrl = baseUrl + '?next_url=' + request.originalUrl
            response.redirect(nextUrl)
        }
    } else {
        log(u.id + ' 已登录')
        next()
    }
}

const adminRequired = async (request, response, next) => {
    const u = await currentUser(request)
    if (await u.isAdmin()) {
        next()
    } else {
        request.session.flash = {
            message: '管理员才能访问这个页面',
        }
        // response.locals.flash = {
        //     message: '管理员才能访问这个页面',
        // }
        // response.redirect('/login')

        const baseUrl = '/login'
        if (request.method === 'GET') {
            response.redirect(baseUrl)
        } else {
            // 应该用一个函数来生成 url, 这里的写法实际上并不好, 因为以后可能还会添加相关的数据
            const nextUrl = baseUrl + '?next_url=' + request.originalUrl
            response.redirect(nextUrl)
        }
    }
}

module.exports = {
    currentUser: currentUser,
    loginRequired: loginRequired,
    adminRequired: adminRequired,
}