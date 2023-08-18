import SocketEventsMap from './SocketEventsMap';

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
}
