import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {main, stop} from '../src/bootstrap';
import {io} from 'socket.io-client';

beforeAll(() => main(8002));
afterAll(() => stop());

describe('Base connection', () => {
    it('Open and close websocket connection', () => new Promise<void>(done => {
        const socket = io('http://127.0.0.1:8002/', {
            transports: ['websocket']
        });
        socket.on('connect', () => {
            expect(socket.connected).toBe(true);
            expect(socket.io.engine.transport.name).toBe('websocket');

            socket.disconnect();
            expect(socket.connected).toBe(false);
            done();
        });
    }));
    it('Open and close polling connection', () => new Promise<void>(done => {
        const socket = io('http://127.0.0.1:8002/', {
            transports: ['polling']
        });
        socket.on('connect', () => {
            expect(socket.connected).toBe(true);
            expect(socket.io.engine.transport.name).toBe('polling');

            socket.disconnect();
            expect(socket.connected).toBe(false);
            done();
        });
    }));
});
