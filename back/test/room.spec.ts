import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {default as io, Socket} from 'socket.io-client';
import SocketInMethods from '../src/socket/SocketInMethods';
import SocketOutMethods from '../src/socket/SocketOutMethods';
import KCallServer from '../src/server';
import KCallSocket from '../src/socket';

let serv: KCallServer;
let sock: KCallSocket;
beforeAll(() => {
    serv = new KCallServer();
    sock = new KCallSocket(serv.server);
    sock.setup();
    serv.server.listen(7001);
});
afterAll(() => {
    sock.io.close();
    serv.server.close();
})

describe('Room join and leave', () => {
    let socket: Socket<SocketInMethods, SocketOutMethods>;

    it('Connect', () => {
        socket = io('ws://localhost:7001');
        expect(socket).toBeInstanceOf(Socket);
    })
    it('Join room', () => new Promise<void>(done => {
        socket.on('joinAccepted', (args) => {
            expect(true).toBe(true);
            done();
        });
        socket.emit('joinRoom', '123', '321');
    }));
});
