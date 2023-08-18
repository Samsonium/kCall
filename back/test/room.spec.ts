import {describe, it, expect} from 'vitest';
import {default as io, Socket} from 'socket.io-client';
import SocketInMethods from '../src/socket/SocketInMethods';
import SocketOutMethods from '../src/socket/SocketOutMethods';

describe('Room join and leave', () => {
    let socket: Socket<SocketInMethods, SocketOutMethods>;

    it('Connect', () => {
        socket = io('ws://localhost:7000');
        expect(socket).toBeInstanceOf(Socket);
    })
    it('Join room', () => new Promise<void>(done => {
        socket.on('joinAccepted', () => {
            expect(true).toBe(true);
            done();
        });
        socket.emit('joinRoom', '123', '321');
    }));
});
