const express = require('express')

const Reply = require('../models/reply')
const Model = Reply
const { log } = require('../utils')
const { currentUser, loginRequired, } = require('./main')

const reply = express.Router()

reply.post('/add', loginRequired, async (request, response) => {
    const form = request.body
    const u = await currentUser(request)
    if(u.id == -1) {
	    response.send('注册登录后即可留言！<script>window.location.href = "`/article/detail/${m.topic_id}`"</script>')
    } else {
	    const kwargs = {
		    user_id: u.id
	    }
	    Object.assign(form, kwargs)
	    const m = await Reply.create(form)
	    response.redirect(`/article/detail/${m.topic_id}`)
    }
})

module.exports = reply