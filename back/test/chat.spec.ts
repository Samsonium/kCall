import {v4} from 'uuid';
import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {default as io, Socket} from 'socket.io-client';
import SocketInMethods from '../../types/SocketInMethods';
import SocketOutMethods from '../../types/SocketOutMethods';
import KCallSocket from '../src/socket';
import KCallServer from '../src/server';

describe('Room chat', () => {
    let socket1: Socket<SocketInMethods, SocketOutMethods>;
    let socket2: Socket<SocketInMethods, SocketOutMethods>;

    const randomRoomId = v4();
    const sock1ID = v4();
    const sock2ID = v4();
    let ksock: KCallSocket;
    let kserv: KCallServer;

    beforeAll(() => {
        kserv = new KCallServer();
        ksock = new KCallSocket(kserv.server);
        ksock.setup();
        kserv.server.listen(7001);
    });

    afterAll(() => {
        ksock.io.close();
        kserv.server.close();
    });

    it('Connect', () => new Promise<void>(done => {
        socket1 = io('ws://localhost:7001', { path: '/socket' });
        socket2 = io('ws://localhost:7001', { path: '/socket' });

        socket1.once('connect', () => {
            expect(socket1.connected).toBe(true);
            done();
        });
    }));

    it('Join room', () => new Promise<void>(done => {
        socket1.once('joinAccepted', () => {
            done();
        });
        socket1.emit('joinRoom', randomRoomId, {
            userID: sock1ID,
            peerID: sock1ID,
            displayName: 'Socket 1'
        });
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
            expect(chatHistory.chat).toBeInstanceOf(Array);
            expect(chatHistory.chat[0].message).toBe('Hello!');
            done();
        });
        socket2.emit('joinRoom', randomRoomId, {
            userID: sock2ID,
            peerID: sock2ID,
            displayName: 'Socket 2'
        });
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
