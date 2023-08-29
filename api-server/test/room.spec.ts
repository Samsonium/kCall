import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {RoomMember, SocketClientEvents, SocketServerEvents} from 'tools/types/types';
import {main, stop} from '../src/bootstrap';
import {io, Socket} from 'socket.io-client';

beforeAll(() => main(8003));
afterAll(() => stop());

describe('Room join and leave', () => {
    it('Join room', () => new Promise<void>(done => {
        const socket: Socket<SocketServerEvents, SocketClientEvents> = io('http://localhost:8003/');

        const userID = '54321';
        const roomID = '12345';
        const displayName = 'Tyler';

        socket.on('connect', () => {
            socket.on('joinAccept', (room) => {
                expect(room.id).toBe(roomID);
                expect(room.members).toBeInstanceOf(Array);
                expect(room.chat).toBeInstanceOf(Array);
                expect(room.members).toHaveLength(1);
                expect(room.members[0]).toStrictEqual({
                    uid: userID,
                    name: displayName,
                    streamOptions: {
                        audio: true,
                        video: false
                    }
                });
                socket.disconnect();
                done();
            });
            socket.emit('joinRoom', roomID, {
                uid: userID,
                name: displayName,
                streamOptions: {
                    audio: true,
                    video: false
                }
            });
        });
    }));
    it('Two sockets joins room', () => new Promise<void>(done => {
        const roomID = 'test-room-id';
        const setup: RoomMember[] = [
            {
                uid: 'socket1',
                name: 'Socket 1',
                streamOptions: {
                    audio: true,
                    video: false
                }
            },
            {
                uid: 'socket2',
                name: 'Socket 2',
                streamOptions: {
                    audio: false,
                    video: true
                }
            }
        ];

        let sock1: Socket<SocketServerEvents, SocketClientEvents>,
            sock2: Socket<SocketServerEvents, SocketClientEvents>;
        sock1 = io('http://localhost:8003/');
        sock1.on('connect', () => {
            sock1.on('joinAccept', (room) => {
                expect(room.members).toHaveLength(1);
                expect(room.members[0]).toStrictEqual(setup[0]);

                setTimeout(() => sock2.emit('joinRoom', roomID, setup[1]));
            });
            sock1.emit('joinRoom', roomID, setup[0]);
        });

        sock2 = io('http://localhost:8003/');
        sock2.on('connect', () => {
            sock2.on('joinAccept', (room) => {
                expect(room.members).toHaveLength(2);
                expect(room.members[0]).toStrictEqual(setup[0]);
                expect(room.members[1]).toStrictEqual(setup[1]);

                sock1.disconnect();
                sock2.disconnect();
                done();
            });
        });
    }));
});
