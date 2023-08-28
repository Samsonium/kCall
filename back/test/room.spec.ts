import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {default as io, Socket} from 'socket.io-client';
import SocketInMethods from '../../types/SocketInMethods';
import SocketOutMethods from '../../types/SocketOutMethods';
import KCallSocket from '../src/socket';
import KCallServer from '../src/server';

describe('Room join and leave', () => {
    let socket: Socket<SocketInMethods, SocketOutMethods>;
    let ksock: KCallSocket;
    let kserv: KCallServer;

    beforeAll(() => {
        kserv = new KCallServer();
        ksock = new KCallSocket(kserv.server);
        ksock.setup();
        kserv.server.listen(7002);
    });

    afterAll(() => {
        ksock.io.close();
        kserv.server.close();
    });

    it('Connect', () => {
        socket = io('ws://localhost:7002', { path: '/socket' });
        expect(socket).toBeInstanceOf(Socket);
    })
    it('Join room', () => new Promise<void>(done => {
        socket.on('joinAccepted', () => {
            expect(true).toBe(true);
            done();
        });
        socket.emit('joinRoom', '123', {
            userID: '321',
            peerID: '321',
            displayName: 'test'
        });
    }));
});
