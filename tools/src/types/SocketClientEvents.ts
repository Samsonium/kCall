import type RoomMember from './RoomMember';

/**
 * Socket.IO events from client
 */
export default interface SocketClientEvents extends Record<string, (...args: any[]) => void> {

    /**
     * Room join request
     * @param room Room identifier
     * @param metadata Connecting user metadata
     */
    joinRoom: (room: string, metadata: RoomMember) => void;

    /**
     * Send message to room
     * @param text
     */
    sendMessage: (text: string) => void;

    /**
     * Stream track state change
     * @param type
     * @param value
     */
    changeStream: (type: 'audio' | 'video', value: boolean) => void;

    /**
     * Leave room call
     */
    leaveRoom: () => void;
}
