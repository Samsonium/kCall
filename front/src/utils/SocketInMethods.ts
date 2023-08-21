import type SocketEventsMap from './SocketEventsMap';

/**
 * Socket events from client
 */
export default interface SocketInMethods extends SocketEventsMap {
    /**
     * Join specified room
     * @param roomID Room identifier
     * @param userID Peer user identifier
     */
    joinRoom: (roomID: string, userID: string, displayName: string) => void;

    /**
     * Leave room
     */
    leaveRoom: () => void;

    /**
     * Send message to room chat
     * @param message
     */
    sendMessage: (message: string) => void;
}
