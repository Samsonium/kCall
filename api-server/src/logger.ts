import {createLogger, format, transports} from 'winston';

// Formats for logger
const {combine, timestamp, printf} = format;

// Logger transports
const {Console, File} = transports;

/**
 * Winston logger util instance
 */
const logger = createLogger({
    transports: [
        new Console(),
        new File({
            filename: 'current.log'
        })
    ],
    level: 'info',
    format: combine(timestamp({
        format: 'DD.MM.YYYY-HH:mm:ss'
    }), printf((log) => {
        return `[${log.timestamp}][${log.level}]: ${log.message}`;
    }))
});
export default logger;
