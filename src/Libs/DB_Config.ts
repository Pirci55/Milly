import DB from "./DB";

export = class extends DB {
    public async getBotConfig() {
        return this.rowsToObject(await this.sql.select('*').from('botconfig'), 'name');
    }
    public async setBotConfig(object: {}) {
        return this.addRows('botconfig', Object.values(object), ['name']);
    }
};