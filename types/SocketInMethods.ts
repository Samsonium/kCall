import type SocketEventsMap from './SocketEventsMap';
import type RoomConnectionParams from './RoomConnectionParams';

/**
 * Socket events from client
 */
export default interface SocketInMethods extends SocketEventsMap {
    /**
     * Join specified room
     * @param roomID Room identifier
     * @param userID Peer user identifier
     */
    joinRoom: (roomID: string, data: RoomConnectionParams) => void;

    /**
     * Leave room
     */
    leaveRoom: () => void;

    /**
     * Change stream track enabled field
     * @param track Changed track
     * @param isEnabled Current value
     */
    changeStreamParams: (track: 'audio' | 'video', isEnabled: boolean) => void;

    /**
     * Send typingMessage to room chat
     * @param typingMessage
     */
    sendMessage: (message: string) => void;
}
