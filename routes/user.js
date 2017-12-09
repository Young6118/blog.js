const express = require('express')
const multer = require('multer')
const { uploadPath } = require('../config')

const upload = multer({
    dest: uploadPath,
})

const User = require('../models/user')
const { currentUser, loginRequired, } = require('./main')

const main = express.Router()

main.get('/:id', loginRequired, async (request, response) => {
    const id = parseInt(request.params.id)
	const u = await currentUser(request)
    const m = await User.get(id)
	if(u.id != id) {
    	m.password = ''
	}
    const args = {
        user: m,
    }
    response.render('user/profile.html', args)
})

main.post('/upload/avatar', loginRequired, upload.single('avatar'), async (request, response) => {
    const u = await currentUser(request)
    const avatar = request.file
    u.avatar = avatar.filename
    await User.update(u)
    response.redirect(`/user/profile/${u.id}`)
})

main.get('/avatar/:filename', (request, response) => {
    const path = require('path')
    const filename = request.params.filename
    const p = uploadPath + filename
    const absolutePath = path.resolve(p)
    // 实际上图片也是发一个请求, 我们最初的课程是按照 /static?file 的形式来处理的
    // 常见的验证码是一张图片, 处理方式也是这种
    // /captcha?random=45678
    // 点击图片的时候会换一张验证码, 实际上就是拿到前端传过来的随机数,
    // 然后生成一个新的随机数, 最后写入到图片中
    response.sendFile(absolutePath)
})

module.exports = {
    user: main,
}