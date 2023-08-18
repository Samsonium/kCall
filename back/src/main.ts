import KCallServer from './server';
import KCallSocket from './socket';

let kserv: KCallServer;
let ksock: KCallSocket;

function main() {
    kserv = new KCallServer();
    ksock = new KCallSocket(kserv.server);

    ksock.setup();
    kserv.server.listen(7000);
}

try {
    main();
} catch (e) {
    console.log(`[SERVER]: RUNTIME ERROR (${e.message})`);
    ksock?.io?.close?.();
    kserv?.server?.close?.();
}
