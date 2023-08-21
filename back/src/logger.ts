import {createWriteStream, existsSync, mkdirSync, WriteStream} from 'fs';
import {resolve} from 'path';

/**
 * Log utils class
 */
export default class Logger {
    private readonly fileStream: WriteStream;

    private static _instance: Logger;
    private constructor(fileStream: WriteStream) {
        this.fileStream = fileStream;
    }

    /**
     * Get actual filename for log file
     */
    private static getLogName(): string {
        const today = new Date();
        const mask = 'D-M-Y.log';
        return mask.replace('D', today.getDate().toString())
            .replace('M', (today.getMonth() + 1).toString())
            .replace('Y', today.getFullYear().toString());
    }

    /**
     * Get Logger instance
     */
    public static get instance(): Logger {
        if (!Logger._instance) {
            const logsDir = resolve('./logs');
            if (!existsSync(resolve(logsDir)))
                mkdirSync(logsDir);

            const logFilePath = resolve(logsDir, Logger.getLogName());
            const stream = createWriteStream(logFilePath);
            Logger._instance = new Logger(stream);
        }
        return Logger._instance;
    }

    /**
     * Close write stream
     */
    public close(): void {
        this.fileStream?.close();
    }

    /**
     * Get datetime info for log printing
     */
    private getDateTime(): string {
        const date = new Date();
        const mask = 'D-M-Y H:m:s.d';

        return mask.replace('D', date.getDate().toString())
            .replace('M', (date.getMonth() + 1).toString())
            .replace('Y', date.getFullYear().toString())
            .replace('H', date.getHours().toString())
            .replace('m', date.getMinutes().toString())
            .replace('s', date.getSeconds().toString())
            .replace('d', date.getMilliseconds().toString());
    }

    /**
     * Print log to file and console
     */
    private logOut(type: 'INFO' | 'WARNING' | 'ERROR', parts: any[]) {
        const head = `[${this.getDateTime()}][${type}]:`;
        this.fileStream.write(`\n${head} ${parts.join(' ')}`);
        console.log(head, ...parts);
    }

    /**
     * Print informational log
     */
    public info(...parts: any[]): void {
        this.logOut('INFO', parts);
    }

    /**
     * Print warning log
     */
    public warn(...parts: any[]): void {
        this.logOut('WARNING', parts);
    }

    /**
     * Print error log
     */
    public error(...parts: any[]): void {
        this.logOut('ERROR', parts);
    }
}
