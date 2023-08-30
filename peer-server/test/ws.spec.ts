import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {client as Websocket} from 'websocket';
import {main, stop} from '../src/bootstrap';
import fetch from 'node-fetch';
import {utils} from 'tools';

beforeAll(() => main(7002));
afterAll(() => stop());

describe('Server test', () => {
    it('HTTP request for ID', () => new Promise<void>(done => {
        fetch('http://localhost:7002/peerjs/id').then(res => {
            res.text().then(id => {
                expect(id).toBeTypeOf('string');
                expect(id).toMatch(/kuid-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})/);
                done();
            })
        })
    }));
    it('Websocket connection can connect', () => new Promise<void>((resolve, reject) => {
        const connectionURL = new URL('peerjs', 'ws://localhost:7002/');
        connectionURL.searchParams.set('key', 'peerjs');
        connectionURL.searchParams.set('id', utils.generateId('kuid'));
        connectionURL.searchParams.set('token', 'ni789lpa2d');
        connectionURL.searchParams.set('version', '1.4.7');

        const socket = new Websocket();
        socket.on('connect', () => resolve());
        socket.on('connectFailed', (err) => reject(err.message));
        socket.connect(connectionURL.toString());
    }));
});
