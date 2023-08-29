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
    const app = express();
    server = createServer(app);
    io = new SocketServer(server, {
        transports: ['websocket', 'polling'],
        allowEIO3: true,
        cors: {
            origin: '*'
        }
    });

    setupEvents(io);
    server.listen(port ?? 7002);
}

/**
 * Stop serve
 */
export function stop(): void {
    io.close();
    server.close();
}

try {
    main();
} catch (_) {
    stop();
}
