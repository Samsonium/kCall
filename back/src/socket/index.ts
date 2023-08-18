import SocketOutMethods from './SocketOutMethods';
import SocketInMethods from './SocketInMethods';
import SocketData from './SocketData';
import {Server as SocketIOServer, ServerOptions} from 'socket.io';
import {Server} from 'http';

/**
 * Socket server implementation for kCall backend service
 */
export default class KCallSocket {
    private readonly _io: SocketIOServer<SocketInMethods, SocketOutMethods, {}, SocketData>;
    public get io() { return this._io }

    constructor(server: Server, options?: Partial<ServerOptions>) {
        this._io = new SocketIOServer(server, {
            allowEIO3: true,
            ...(options ?? {})
        });
    }

    public setup(): void {
        this._io.on('connection', (socket) => {
            console.log(`[${socket.id}]: CONNECTED`)

            socket.on('joinRoom', (roomID, userID) => {
                console.log(`[${socket.id}][${userID}]: JOINS ROOM ${roomID}`);
                socket.join(roomID);
                socket.to(roomID).emit('userJoined', userID);
                socket.emit('joinAccepted', []);

                // TODO

                socket.on('disconnect', () => {
                    console.log(`[${socket.id}][${userID}]: DISCONNECTED`)
                });
            });
        });
    }
}
