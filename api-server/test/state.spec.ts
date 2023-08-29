import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {RoomMember, SocketClientEvents, SocketServerEvents} from 'tools/types/types';
import {main, stop} from '../src/bootstrap';
import {io, Socket} from 'socket.io-client';

beforeAll(() => main(8004));
afterAll(() => stop());

describe('Room join and leave', () => {
    it('Two sockets and roomUpdate', () => new Promise<void>(done => {
        const roomID = 'test-room';
        const setup: RoomMember[] = [
            {
                uid: 'socket1',
                name: 'Socket 1',
                streamOptions: {
                    audio: false,
                    video: false
                }
            },
            {
                uid: 'socket2',
                name: 'Socket 2',
                streamOptions: {
                    audio: false,
                    video: false
                }
            }
        ];

        let sock1: Socket<SocketServerEvents, SocketClientEvents>,
            sock2: Socket<SocketServerEvents, SocketClientEvents>;
        sock1 = io('http://localhost:8004/');
        sock1.on('connect', () => {
            sock1.on('joinAccept', (room) => {
                sock1.on('roomUpdated', (room) => {
                    expect(room.members[1].streamOptions).toStrictEqual({
                        audio: true,
                        video: false
                    });
                    sock1.disconnect();
                    sock2.disconnect();
                    done();
                });
                sock2.emit('joinRoom', roomID, setup[1])
            });
            sock1.emit('joinRoom', roomID, setup[0]);
        });

        sock2 = io('http://localhost:8004/');
        sock2.on('connect', () => {
            sock2.on('joinAccept', (room) => {
                sock2.emit('changeStream', 'audio', true);
            });
        });
    }));
});
