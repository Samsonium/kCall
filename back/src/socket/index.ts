import {Server as SocketIOServer, ServerOptions} from 'socket.io';
import {Server} from 'http';
import Logger from '../logger';

import type RoomData from '../../../types/RoomData';
import type SocketInMethods from '../../../types/SocketInMethods';
import type SocketOutMethods from '../../../types/SocketOutMethods';

/**
 * Socket server implementation for kCall backend service
 */
export default class KCallSocket {
    private readonly rooms: Map<string, RoomData>;
    private readonly _io: SocketIOServer<SocketInMethods, SocketOutMethods>;
    public get io() { return this._io }

    constructor(server: Server, options?: Partial<ServerOptions>) {
        this._io = new SocketIOServer(server, {
            allowEIO3: true,
            path: '/socket',
            cors: {
                origin: '*'
            },
            ...(options ?? {})
        });
        this.chats = new Map();
    }

    public setup(): void {
        this._io.on('connection', (socket) => {
            Logger.instance.info(`[${socket.id}]: CONNECTED`)

            socket.on('joinRoom', (roomID, userID, displayName: string) => {
                Logger.instance.info(`[${socket.id}][${userID}]: JOINS ROOM ${roomID} with name ${displayName}`);
                socket.join(roomID);
                socket.to(roomID).emit('userJoined', userID, displayName);

                // Check room in chats map
                if (!this.chats.has(roomID))
                    this.chats.set(roomID, [])
                socket.emit('joinAccepted', this.chats.get(roomID));

                // Send message
                socket.on('sendMessage', (message) => {
                    Logger.instance.info(`[${socket.id}][${userID}]: MESSAGE TO ROOM ${roomID} -> ${message}`)
                    this.io.to(roomID).emit('newMessage', displayName, message);
                    this.chats.get(roomID).push({
                        name: displayName,
                        message
                    });
                });

                // Retrieve user data by its id
                socket.on('whoIsIt', (userID, callback) => {
                    Logger.instance.info(`[${socket.id}][${userID}]: LOOKING FOR ${userID} name`);
                    callback({
                        id: userID,
                        name: 'This is this'
                    });
                });

                // TODO

                socket.on('disconnect', () => {
                    this.io.to(roomID).emit('userLeaved', userID);
                    socket.leave(roomID);

                    Logger.instance.info(`[${socket.id}][${userID}]: DISCONNECTED`)
                });
            });
        });
    }
}
