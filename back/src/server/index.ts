import {Server} from 'http';
import express from 'express';

/**
 * ExpressJS server
 */
export default class KCallServer {
    private readonly _server: Server;
    public get server() { return this._server }

    constructor() {
        const app = express();
        this._server = new Server(app);
    }
}
