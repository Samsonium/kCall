import logger from './logger';
import * as service from './service';
import type {Server, Socket} from 'socket.io';
import type {SocketClientEvents, SocketServerEvents} from 'tools/types/types';

/**
 * Setup Socket.IO server events
 * @param server
 */
export default function setupEvents(server: Server): void {
    server.on('connect', (socket: Socket<SocketClientEvents, SocketServerEvents>) => {
        logger.info('New socket has connected: ' + socket.id);

        // Disconnect function
        const handleDisconnect = () => {
            logger.info(socket.id + ' has disconnected');
        };

        // Join room event
        socket.on('joinRoom', (room, metadata) => {
            logger.info('Socket ' + socket.id + ' connecting to room ' + room, metadata);
            const roomData = service.joinRoom(room, metadata)

            // Approve connection
            socket.join(room);
            socket.emit('joinAccept', roomData);
            socket.to(room).emit('userJoined', metadata);
            logger.info('Approved connection to room ' + room + ' for socket ' + socket.id);

            // User sent message event
            socket.on('sendMessage', (text) => {
                logger.info(metadata.uid + ' sent message to ' + room + ' => ' + text);
                const message = service.sendMessage(room, metadata.uid, text);
                socket.to(room).emit('newMessage', message);
            });

            // User stream changed event
            socket.on('changeStream', (type, value) => {
                logger.info(metadata.uid + ' set "' + type + '" track state to ' + value);
                const roomData = service.changeStream(room, metadata.uid, type, value);
                socket.to(room).emit('roomUpdated', roomData);
            });

            // User has leaved room
            socket.off('disconnect', handleDisconnect);
            socket.on('disconnect', () => {
                logger.info('User ' + socket.id + ' has disconnected');
                service.leaveRoom(room, metadata.uid);
                socket.to(room).emit('userLeave', metadata);
            });
        });

        // User leave room event
        socket.on('disconnect', handleDisconnect);
    });
}
