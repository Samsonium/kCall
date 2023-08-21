import KCallServer from './server';
import KCallSocket from './socket';
import Logger from './logger';

let kserv: KCallServer;
let ksock: KCallSocket;

function main() {
    kserv = new KCallServer();
    ksock = new KCallSocket(kserv.server);

    ksock.setup();
    kserv.server.listen(7000, () => {
        Logger.instance.info('Server started!');
    });
}

try {
    main();
} catch (e) {
    console.log(`[SERVER]: RUNTIME ERROR (${e.message})`);
    ksock?.io?.close();
    kserv?.server?.close();
}
