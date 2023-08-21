import {v4} from 'uuid';
import {describe, it, expect} from 'vitest';
import {default as io, Socket} from 'socket.io-client';
import SocketInMethods from '../src/socket/SocketInMethods';
import SocketOutMethods from '../src/socket/SocketOutMethods';

describe('Room chat', () => {
    let socket1: Socket<SocketInMethods, SocketOutMethods>;
    let socket2: Socket<SocketInMethods, SocketOutMethods>;

    const randomRoomId = v4();
    const sock1ID = v4();
    const sock2ID = v4();

    it('Connect', () => new Promise<void>(done => {
        socket1 = io('ws://localhost:7000', { path: '/socket' });
        socket2 = io('ws://localhost:7000', { path: '/socket' });

        socket1.once('connect', () => {
            expect(socket1.connected).toBe(true);
            done();
        });
    }));

    it('Join room', () => new Promise<void>(done => {
        socket1.once('joinAccepted', () => {
            done();
        });
        socket1.emit('joinRoom', randomRoomId, sock1ID, 'Socket 1');
    }));

    it('Send message', () => new Promise<void>(done => {
        socket1.once('newMessage', (name, message) => {
            expect(name).toBe('Socket 1');
            expect(message).toBe('Hello!');
            done();
        });
        socket1.emit('sendMessage', 'Hello!');
    }));

    it('Add second connection', () => new Promise<void>(done => {
        socket2.once('joinAccepted', (chatHistory) => {
            expect(chatHistory).toBeInstanceOf(Array);
            expect(chatHistory[0].message).toBe('Hello!');
            done();
        });
        socket2.emit('joinRoom', randomRoomId, sock2ID, 'Socket 2');
    }));

    it('Send message from second and check on first', () => new Promise<void>(done => {
        socket1.once('newMessage', (name, message) => {
            expect(name).toBe('Socket 2');
            expect(message).toBe(message);
            done();
        });
        socket2.emit('sendMessage', 'Hi!');
    }));
});