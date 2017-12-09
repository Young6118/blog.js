const { MongoClient,Server } = require('mongodb')
const mongodbName = 'blog'
const url = `mongodb://localhost:27017/${mongodbName}`
// const mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true})

const monguaDb = async () => {
	// console.log(Object.keys(mongoclient))
	// const mongo = await mongoclient.open()
	// const db = mongo.db(mongodbName)
	const db = await MongoClient.connect(url)
	return db
}

const nextId = async (name) => {
	const query = {
		name: name,
	}
	const update = {
		$inc: {
			seq: 1,
		}
	}
	const options = {
		upsert: true,
		returnOriginal: false,
	}
	const db = await monguaDb()
	const doc = db.collection('data_id')
	const d = await doc.findOneAndUpdate(query, update, options)
	const newId = d.value.seq
	db.close()
	return newId
}

class Model {
	static has(query) {
		return this.findOne(query) !== null
	}

	toString() {
		const s = JSON.stringify(this, null, 2)
		return s
	}

	static async create(form={}) {
		const m = new this()
		const name = this.name.toLowerCase()
		m.id = await nextId(name)
		const ts = Date.now()
		m.created_time = ts
		m.updated_time = ts
		m.deleted = false
		Object.assign(m, form)
		await m.save()
		return m
	}

	static _new_from_bson(bson) {
		const m = new this()
		Object.keys(bson).forEach((k) => {
			const v = bson[k]
			m[k] = v
		})
		m.type = this.name.toLowerCase()
		return m
	}

	static async all() {
		const name = this.name.toLowerCase()
		// let l
		// promise 实现
		// monguaDb().then(function(content) {
		// 	return content.collection(name).find()
		// }).then(function(c1) {
		// 	return c1.map((d) => {
		// 		return this._new_from_bson(d)
		// 	})
		// }).then(function(c2) {
		// 	l = c2
		// })
		const db = await monguaDb()
		const obj = await db.collection(name).find({})
		const ds = await obj.toArray()
		db.close()
		const l = ds.map((d) => {
			return this._new_from_bson(d)
		})
		return l
	}

	static async find(query = {}) {
		const name = this.name.toLowerCase()
		// let sortKey = null
		// if ('__sort_key' in query) {
		// 	sortKey = query['__sort_key']
		// 	delete query['__sort_key']
		// }
		// if (sortKey !== null) {
		// 	ds = ds.sort(sortKey)
		// }
		const db = await monguaDb()
		const obj = await db.collection(name).find(query)
		const ds = await obj.toArray()
		db.close()
		const l = ds.map((d) => {
			return this._new_from_bson(d)
		})
		return l
	}

	static get(id) {
		return this.findOne({
			id: id
		})
	}

	static async findOne(query) {
		const l = await this.find(query)
		if (l.length > 0) {
			return l[0]
		} else {
			return null
		}
	}

	async save() {
		this.updated_time = Date.now()
		const name = this.constructor.name.toLowerCase()
		const db = await monguaDb()
		const r = await db.collection(name).insertOne(this)
		db.close()
		return r
	}

	static async trash() {
		this.deleted = true
		await this.save()
	}

	static async remove(instance) {
		const db = await monguaDb()
		const id = instance.id
		const name = instance.constructor.name.toLowerCase()
		const r = await db.collection(name).deleteOne({ id })
		db.close()
		return r
	}


	static async update(instance) {
		instance.updated_time = Date.now()
		const id = instance.id
		const db = await monguaDb()
		const name = instance.constructor.name.toLowerCase()
		const r = await db.collection(name).updateOne({id}, instance)
		db.close()
		return r
	}
}

class User extends Model {
	static _fields() {
		const p = Model._fields()
		const f = [
			['username', String, ''],
			['password', String, ''],
		]
		const l = p.concat(f)
		return l
	}
}

const test = async () => {
	// const form = {
	// 	username: 'lin',
	// 	password: '123',
	// }
	// const u = await User.create(form)
	const u = await User.all()
	console.log(u)
}

if (require.main === module) {
	test().catch((e) => {
		console.log('debug error', e)
	})
}

module.exports = Model