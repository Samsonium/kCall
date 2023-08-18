import SocketOutMethods from './SocketOutMethods';
import SocketInMethods from './SocketInMethods';
import SocketData from './SocketData';
import {Server as SocketIOServer, ServerOptions} from 'socket.io';
import {Server} from 'http';

/**
 * Socket server implementation for kCall backend service
 */
export default class KCallSocket {
    private readonly chats: Map<string, { name: string, message: string }[]>;
    private readonly _io: SocketIOServer<SocketInMethods, SocketOutMethods, {}, SocketData>;
    public get io() { return this._io }

    constructor(server: Server, options?: Partial<ServerOptions>) {
        this._io = new SocketIOServer(server, {
            allowEIO3: true,
            ...(options ?? {})
        });
        this.chats = new Map();
    }

    public setup(): void {
        this._io.on('connection', (socket) => {
            console.log(`[${socket.id}]: CONNECTED`)

            socket.on('joinRoom', (roomID, userID) => {
                console.log(`[${socket.id}][${userID}]: JOINS ROOM ${roomID}`);
                socket.join(roomID);
                socket.to(roomID).emit('userJoined', userID);

                // Check room in chats map
                if (!this.chats.has(roomID))
                    this.chats.set(roomID, [])
                socket.emit('joinAccepted', this.chats.get(roomID));

                // Send message
                socket.on('sendMessage', (message) => {
                    console.log(`[${socket.id}][${userID}]: MESSAGE TO ROOM ${roomID} -> ${message}`)
                    this.io.to(roomID).emit('newMessage', userID, message);
                    this.chats.get(roomID).push({
                        name: userID,
                        message
                    });
                });

                // TODO

                socket.on('disconnect', () => {
                    console.log(`[${socket.id}][${userID}]: DISCONNECTED`)
                });
            });
        });
    }
}
