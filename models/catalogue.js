const Model = require('./main')

class Catalogue extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.title = form.title || ''
        this.ct = Date.now()
        this.ut = this.ct
    }

    static async update(form={}) {
        const id = Number(form.id)
        const m = await this.get(id)
        const keys = this.frozenKeys()
        Object.keys(form).forEach((k) => {
            if (!keys.includes(k)) {
                m[k] = form[k]
            }
        })
        m.ut = Date.now()
        await super.update(m)
        return m
    }

    static async get(id) {
	    const f = new this()
	    const m = await super.get(Number(id))
	    Object.assign(f, m)
	    return f
    }

    static frozenKeys() {
        const l = [
            'id',
            'ct',
        ]
        return l
    }
}

module.exports = Catalogue