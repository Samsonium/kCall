import logger from './logger';
import express from 'express';
import setupEvents from './controller';
import {createServer, Server} from 'http';
import {Server as SocketServer} from 'socket.io';

/**
 * HTTP server
 */
let server: Server;

/**
 * Socket.IO server
 */
let io: SocketServer;

/**
 * Start server
 */
export function main(port?: number): void {
    const usingPort = port ?? 7000;
    const app = express();
    server = createServer(app);
    io = new SocketServer(server, {
        transports: ['websocket', 'polling'],
        allowEIO3: true,
        cors: {
            origin: '*',
            methods: ['POST', 'GET'],
            credentials: true,
        }
    });

    setupEvents(io);
    logger.info('Socket events set');

    server.listen(usingPort, () => {
        logger.info('Server started at port ' + (usingPort ?? 7002));
    });
}

/**
 * Stop serve
 */
export function stop(): void {
    io.close();
    server.close();
}
