import logger from './logger';
import type {Server, Socket} from 'socket.io';
import type {SocketClientEvents, SocketServerEvents} from 'tools/types/types';

/**
 * Setup Socket.IO server events
 * @param server
 */
export default function setupEvents(server: Server): void {
    server.on('connect', (socket: Socket<SocketClientEvents, SocketServerEvents>) => {
        logger.info('New socket has connected: ' + socket.id);

        // Join room event
        socket.on('joinRoom', (room, metadata) => {
            logger.info('Socket ' + socket.id + ' connecting to room ' + room, metadata);
            // TODO: service.joinRoom

            // User sent message event
            socket.on('sendMessage', (text) => {
                // TODO: service.sendMessage
            });

            // User stream changed event
            socket.on('changeStream', (type, value) => {
                // TODO: service.changeStream
            });

            // User leave room event
            socket.on('leaveRoom', () => {
                // TODO: service.leaveRoom
            });
        });
    });
}
