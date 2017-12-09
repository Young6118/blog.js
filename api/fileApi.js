const express = require('express')
const multer = require('multer')
const { imgPath } = require('../config')
const { jsonResponse } = require('./main')
const { log } = require('../utils')

const upload = multer({
	dest: imgPath,
})

const { currentUser, loginRequired, } = require('../routes/main')

const apiFile = express.Router()

apiFile.post('/img', upload.single('file'), (request, response) => {
	const dict = {
		success: true,
		data: request.file.filename,
		message: '',
	}
	const access = request.body.key == '1234' && request.body.uid.indexOf('client_') == 0
	log('上传图片', access, dict.data)
	jsonResponse(request, response, dict)
})

apiFile.get('/img/:img', (request, response) => {
	const path = require('path')
	const img = request.params.img
	const p = imgPath + img
	const absolutePath = path.resolve(p)
	response.sendFile(absolutePath)
})

module.exports = {
	apiFile: apiFile,
}