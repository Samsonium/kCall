import {readFileSync} from 'node:fs';
import {join} from 'node:path';

export default () => {
    try {
        return JSON.parse(readFileSync(join(__dirname, '..', 'kcall.config.json')).toString('utf-8'))
    } catch (_) {
        return {
            db: {
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'root',
                database: 'kcall'
            }
        };
    }
};
