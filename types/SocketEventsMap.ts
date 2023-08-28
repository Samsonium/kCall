/**
 * Base socket event data
 */
export default interface SocketEventsMap {
    [eventName: string]: (...args: any[]) => unknown;
};
