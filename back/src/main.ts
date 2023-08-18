import KCallServer from './server';
import KCallSocket from './socket';

function main() {
    const kserv = new KCallServer();
    const ksock = new KCallSocket(kserv.server);

    ksock.setup();
    kserv.server.listen(7000);
}
main();
