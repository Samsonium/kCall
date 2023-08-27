import SocketEventsMap from './SocketEventsMap';
import RoomData from './RoomData';

/**
 * Socket events from server
 */
export default interface SocketOutMethods extends SocketEventsMap {
    /**
     * Accept user room join request
     * @param chatHistory
     */
    joinAccepted: (roomData: RoomData) => void;

    /**
     * User joins the room
     * @param userID
     */
    userJoined: (data: RoomData['members'][number]) => void;

    /**
     * User leaves the room
     * @param userID
     */
    userLeaved: (userID: string) => void;

    /**
     * User sends typingMessage
     * @param userID
     * @param typingMessage
     */
    newMessage: (userID: string, message: string) => void;

    /**
     * Room data event
     * @param roomData
     */
    roomDataUpdate: (roomData: RoomData) => void;
}
