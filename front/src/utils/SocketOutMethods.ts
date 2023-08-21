import type SocketEventsMap from './SocketEventsMap';

/**
 * Socket events from server
 */
export default interface SocketOutMethods extends SocketEventsMap {
    /**
     * Accept user room join request
     * @param chatHistory
     */
    joinAccepted: (chatHistory: {name: string, message: string}[]) => void;

    /**
     * User joins the room
     * @param userID
     */
    userJoined: (userID: string) => void;

    /**
     * User leaves the room
     * @param userID
     */
    userLeaved: (userID: string) => void;

    /**
     * User sends message
     * @param userID
     * @param message
     */
    newMessage: (userID: string, message: string) => void;
}
