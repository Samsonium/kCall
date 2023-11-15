import {readFileSync} from 'node:fs';
import {join} from 'node:path';

/**
 * Parses the content of the 'kcall.config.json' file and returns it as a JavaScript object.
 *
 * @returns {Record<string, any>} The parsed JavaScript object representing the content of the 'kcall.config.json' file.
 */
export default (): Record<string, any> => JSON.parse(
    readFileSync(
        join(
            __dirname,
            '..',
            'kcall.config.json'
        )
    ).toString('utf-8')
);
