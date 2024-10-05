import knex from 'knex';

const config = {
    database: 'milly',
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
};
const MySQL = knex({
    client: 'mysql2',
    connection: config,
    log: {
        deprecate(m) { console.error('УСТАРЕВАНИЕ:', m); },
        debug(m) { console.error('ОТЛАДКА:', m); },
        error(e) { console.error('ОШИБКА:', e); },
        warn(e) { console.error('ПРЕДУПРЕЖДЕНИЕ:', e); },
        enableColors: true
    }
});

export = class {
    public get sql() {
        return MySQL;
    }
    public get dbname() {
        return config.database;
    }
    public rowsToObject(rows: any[], key: string) {
        const result = {};
        rows.forEach(row => {
            result[row[key]] = row;
        });
        return result;
    }
    public objectToRows(object: {}) {
        const result = [];
        Object.values(object).forEach(row => result.push(row));
        return result;
    }
    public getColumn(query: any[], columnName: string) {
        const result = [];
        query.forEach(row => {
            result.push(row[columnName]);
        });
        return result;
    }
    public async addRow(
        table: string,
        row: {},
        checkColumns: string[]
    ) {
        const condition = {};
        for (const column of checkColumns) {
            condition[column] = row[column];
        };
        const nowTable = await this.sql
            .select('*')
            .from(table)
            .where(condition);
        if (nowTable.length == 0) {
            await this.sql
                .insert(row)
                .into(table)
                .catch(e => console.error(e));
        } else {
            await this.sql
                .update(row)
                .table(table)
                .where(condition)
                .catch(e => console.error(e));
        };
    }
    public async addRows(
        table: string,
        rows: object[],
        checkColumns: string[]
    ) {
        for (const row of rows) {
            this.addRow(table, row, checkColumns);
        };
    }
};