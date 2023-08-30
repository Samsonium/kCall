import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {main, stop} from '../src/bootstrap';
import {utils} from 'tools';
import {client as Websocket} from 'websocket';
import fetch from 'node-fetch';

beforeAll(() => main(7001));
afterAll(() => stop());

describe('Server test', () => {
    it('HTTP request for ID', () => new Promise<void>(done => {
        fetch('http://localhost:7001/peerjs/id').then(res => {
            res.text().then(id => {
                expect(id).toBeTypeOf('string');
                expect(id).toMatch(/kuid-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})/);
                done();
            })
        })
    }));
    it('Websocket connection can connect', () => new Promise<void>((resolve, reject) => {
        const connectionURL = new URL('peerjs', 'ws://localhost:7001/');
        connectionURL.searchParams.set('key', 'peerjs');
        connectionURL.searchParams.set('id', utils.generateId('kuid'));
        connectionURL.searchParams.set('token', 'ni789lpa2d');
        connectionURL.searchParams.set('version', '1.4.7');

        const socket = new Websocket();
        socket.on('connect', () => resolve());
        socket.on('connectFailed', () => reject());
        socket.connect(connectionURL.toString());
    }));
});
