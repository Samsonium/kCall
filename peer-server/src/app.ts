import {main, stop} from './bootstrap';

try {
    main();
} catch (_) {
    stop();
}
