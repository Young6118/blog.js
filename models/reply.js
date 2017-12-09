const Model = require('./main')

class Reply extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.content = form.content || ''
        this.ct = Date.now()
        this.ut = this.ct
        this.topic_id = Number(form.topic_id || -1)
    }
}

module.exports = Reply