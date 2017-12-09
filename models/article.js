const Model = require('./main')
var hljs = require('highlight.js')
var md = require('markdown-it')({
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}

		return ''
	}
})
class Article extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        // views 是这个 article 的浏览数目
        this.views = 0
        this.title = form.title || ''
        this.content = form.content || ''
        this.ct = Date.now()
        this.ut = this.ct
	    this.replies = 0
        this.user_id = form.user_id || ''
        this.board_id = Number(form.board_id || -1)
    }

    static async get(id) {
    	const f = new this()
	    const m = await super.get(id)
	    Object.assign(f, m)
        f.views += 1
        await super.update(f)
        return f
    }

    static async fakeCreate(form) {
        const m = await super.create(form)
        if (m === null) {
            const obj = {
                success: false,
                data: null,
                message: '用户名已经使用',
            }
            return obj
        } else {
            const obj = {
                success: true,
                data: m,
                message: '',
            }
            return obj
        }
    }

    static async allList(board_id) {
        let ms = []
        if (board_id === -1) {
            ms = await super.all()
        } else {
            ms = await super.find({board_id : Number(board_id)})
        }
        return ms
    }

	static async replies(id) {
		const Reply = require('./reply')
		const ms = await Reply.find({ "topic_id": id.toString() })
		const len = ms.length || 0
		for(i in len) {
			ms[i].content = md.render(ms[i].content)
		}
		return ms
	}

	async username() {
		const User = require('./user')
		const u = await User.get(this.user_id)
		return (async () => {
			return await u.username
		})
	}
}

module.exports = Article