const {resolve} = require('node:path');

/** @type {{apps: import('pm2').StartOptions[]}} */
module.exports = {
    apps: [{
        name: 'API',
        script: 'ts-node',
        pm_cwd: resolve(__dirname, 'api'),
        args: './src/main.ts',
    }]
}
