import {ExpressPeerServer} from 'peer';
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
        app.use('/peer', ExpressPeerServer(this._server, {
            generateClientId: this.generateUserID,
            proxied: true
        }));
        app.use(express.static('public'));
    }

    /**
     * Generate user id for peer connection
     * @returns {string} unique user identifier
     */
    private generateUserID(): string {
        const mask: string = 'kusr-xxxx-xxxx-xxxx';
        const dict: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return mask.replaceAll(/x/g, () => {
            return dict.charAt(Math.floor(Math.random() * dict.length));
        });
    }
}
