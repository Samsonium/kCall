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
        this.rooms = new Map();
    }

    public setup(): void {
        this._io.on('connection', (socket) => {
            Logger.instance.info(`[${socket.id}]: CONNECTED`)

            socket.on('joinRoom', (roomID, data) => {
                Logger.instance.info(`[${data.userID}]: JOINS ROOM ${roomID} with name ${data.displayName}`);
                socket.join(roomID);
                socket.to(roomID).emit('userJoined', data);

                // Check room in chats map
                if (!this.rooms.has(roomID)) this.rooms.set(roomID, {
                    chat: [],
                    members: []
                });

                // Return accept typingMessage to room user
                socket.emit('joinAccepted', this.rooms.get(roomID));

                // Update room info and emit metadata to room members
                this.rooms.get(roomID).members.push(data);
                socket.to(roomID).emit('roomDataUpdate', this.rooms.get(roomID));

                // Send typingMessage
                socket.on('sendMessage', (message) => {
                    Logger.instance.info(`[${data.userID}]: MESSAGE TO ROOM ${roomID} -> ${message}`)
                    this.io.to(roomID).emit('newMessage', data.displayName, message);
                    this.rooms.get(roomID).chat.push({
                        name: data.displayName,
                        message
                    });
                });

                // User changed his track
                socket.on('changeStreamParams', (track, isEnabled) => {
                    const roomMember = this.rooms.get(roomID).members.find((member) => {
                        return member.userID === data.userID;
                    });

                    switch (track) {
                        case 'video':
                            roomMember.stream.isVideoEnabled = isEnabled;
                            break;
                        case 'audio':
                            roomMember.stream.isAudioEnabled = isEnabled;
                            break;
                    }

                    socket.to(roomID).emit('roomDataUpdate', this.rooms.get(roomID));
                });

                // User disconnect
                socket.on('disconnect', () => {
                    this.io.to(roomID).emit('userLeaved', data.userID);
                    socket.leave(roomID);
                    const members = this.rooms.get(roomID).members;
                    members.splice(members.findIndex(m => m.userID === data.userID), 1)

                    Logger.instance.info(`[${data.userID}]: DISCONNECTED`)
                });
            });
        });
    }
}
