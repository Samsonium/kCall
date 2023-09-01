import type RoomData from './RoomData';
import type RoomMember from './RoomMember';
import type RoomMessage from './RoomMessage';

/**
 * Socket.IO events from server
 */
export default interface SocketServerEvents extends Record<string, (...args: any[]) => void> {

    /**
     * Approve user join to room
     * @param room Room data
     */
    joinAccept: (room: RoomData) => void;

    /**
     * New user has connected to room call
     * @param user
     */
    userJoined: (user: RoomMember) => void;

    /**
     * Room data has updated
     * @param room
     */
    roomUpdated: (room: RoomData) => void;

    /**
     * New message from user
     * @param message
     */
    newMessage: (message: RoomMessage) => void;

    /**
     * User has leaved the room
     * @param user
     */
    userLeave: (user: RoomMember) => void;
}
