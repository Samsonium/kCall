import SocketOutMethods from './SocketOutMethods';
import SocketInMethods from './SocketInMethods';
import SocketData from './SocketData';
import {Server as SocketIOServer, Socket, ServerOptions} from 'socket.io';
import {Server} from 'http';

/**
 * Socket server implementation for kCall backend service
 */
export default class KCallSocket {
    private readonly io: SocketIOServer<SocketInMethods, SocketOutMethods, {}, SocketData>;

    constructor(server: Server, options?: Partial<ServerOptions>) {
        this.io = new SocketIOServer(server, {
            allowEIO3: true,
            ...(options ?? {})
        });
    }

    public setup(): void {
        this.io.on('connection', (socket) => {
            // TODO: Socket events
        });
    }
}
