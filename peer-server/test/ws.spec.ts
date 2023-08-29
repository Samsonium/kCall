import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {main, stop} from '../src/app';
import fetch from 'node-fetch';

beforeAll(() => main());
afterAll(() => stop());

describe('Server test', () => {
    it('HTTP request for ID', () => new Promise<void>(done => {
        fetch('http://localhost:7000/peerjs/id').then(res => {
            res.text().then(id => {
                expect(id).toBeTypeOf('string');
                expect(id).toMatch(/kuid-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})/);
                done();
            })
        })
    }));
});
