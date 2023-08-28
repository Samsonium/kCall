const { resolve } = require('path');

const cwd = resolve(__dirname);
module.exports = {
    apps: [
        {
            name: 'Client',
            script: 'yarn',
            args: 'workspace client dev',
            cwd
        },
        {
            name: 'API Server',
            script: 'yarn',
            args: 'workspace api-server dev',
            cwd,
            env_dev: {
                NODE_ENV: 'dev'
            }
        },
        {
            name: 'PeerJS Server',
            script: 'yarn',
            args: 'workspace peer-server dev',
            cwd,
            env_dev: {
                NODE_ENV: 'dev'
            }
        }
    ]
}
