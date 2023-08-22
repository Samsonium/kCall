import {describe, it, vi, expect, afterEach, afterAll, beforeAll} from 'vitest';
import {existsSync, readdirSync} from 'fs';
import {resolve} from 'path';
import Logger from '../src/logger';

describe('Logger util', () => {
    const logMock = vi.spyOn(console, 'log')
        .mockImplementation(() => {});
    let logger: Logger;

    afterEach(() => {
        logMock.mockClear()
    });

    it('Instantiates without problems', () => {
        logger = Logger.instance;
        expect(logger).toBeInstanceOf(Logger);
    });
    it('Creates logs dir', () => {
        expect(existsSync(resolve('./logs'))).toBe(true);
    });
    it('Creates log files', () => new Promise<void>(done => {
        new Promise(r => setTimeout(r, 100)).then(() => {
            const dirFiles = readdirSync(resolve('./logs'));
            expect(dirFiles.length).toBeGreaterThan(0);
            done();
        })
    }));
    it('Info log works normally', () => {
        const message = 'Hello, World!';
        logger.info(message);
        expect(logMock.mock.lastCall[1]).toBe(message);
    });
    it('Warning log works normally', () => {
        const message = 'Hello, World!';
        logger.warn(message);
        expect(logMock.mock.lastCall[1]).toBe(message);
    });
});
