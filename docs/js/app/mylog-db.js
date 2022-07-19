class MyLogDb {
    constructor() {
        this.version = 1
        this.name = `mylog-${this.version}.db`
        this.dexie = new Dexie(this.name)
        this.create()
    }
    create() {
        this.dexie.version(this.version).stores({
            comments: `++id`,
        })
    }
    async clear() { await this.dexie.comments.clear() }
    insert(content) {
        console.debug(`挿入`, content)
        const now = Math.floor(new Date().getTime() / 1000)
        this.dexie.comments.put({
            content: content,
            created: now,
        })
        return this.#insertHtml(content, now)
    }
    #insertHtml(content, created) {
        return `<p>${this.#toContent(content)}<br>${this.#toTime(created)}</p>`
    }
    async toHtml() {
        const cms = await this.dexie.comments.toArray()
        cms.sort((a,b)=>b.created - a.created)
        return cms.map(c=>this.#insertHtml(c.content, c.created)).join('')
    }
    #toTime(created) {
        const d = new Date(created * 1000)
        const u = d.toISOString()
        const l = d.toLocaleString({ timeZone: 'Asia/Tokyo' })
        return `<time datetime="${u}">${l}</time>`
    }
    #toContent(content) {
        return content.replace(/\r\n|\n/g, '<br>')
    }
}
