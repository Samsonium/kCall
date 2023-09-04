import {createLogger, format, transports} from 'winston';
import {PeerServer} from 'peer';
import {Server} from "http";

// Format loggers
const {combine, timestamp, printf} = format;

/** Server variable */
let server: Server;

/**
 * Bootstrap function
 */
export function main(port?: number) {
    const logger = createLogger({
        level: 'info',
        format: combine(
            timestamp({
                format: 'DD.MM.YYYY-HH:mm:ss'
            }),
            printf((log) => {
                return `[${log.timestamp}][${log.level}]: ${log.message}`
            })
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'current.log'
            })
        ]
    });

    /**
     * PeerJS server instance
     */
    const peerServer = PeerServer({
        host: '127.0.0.1',
        port: port ?? 7001,
        proxied: true,
        generateClientId: () => {
            const prefix = 'kusr';
            const blocksCount = 4;

            const generateBlock = () => Math.random().toString(16).substring(2, 6);
            return [prefix, ...(new Array(blocksCount)).fill(0).map(generateBlock)].join('-');
        },
        corsOptions: {
            origin: '*'
        }
    }, (_server) => server = _server);
    logger.info('Peer server instantiated');

    /**
     * Peer connection event handler
     */
    peerServer.on('connection', (client) => {
        logger.info('New peer connected: ' + client.getId());
    });

    /**
     * Peer disconnect event handler
     */
    peerServer.on('disconnect', (client) => {
        logger.info('Peer disconnected: ' + client.getId());
    });

    /**
     * Error event handler
     */
    peerServer.on('error', (error) => {
        logger.error('Got error on peer: ' + error.message);
    });

    /**
     * Node.js process exception handler
     */
    process.on('uncaughtException', (error) => {
        console.error('Got error on node: ' + error.message);
        process.exit(1);
    });
}

/**
 * Stop server
 */
export function stop() {
    server.close();
}
