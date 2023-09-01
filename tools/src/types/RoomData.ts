import type RoomMember from './RoomMember';
import RoomMessage from './RoomMessage';

/**
 * Call room data
 */
export default interface RoomData {

    /**
     * Room identifier
     */
    id: string;

    /**
     * Room members
     */
    members: RoomMember[];

    /**
     * Room chat history
     */
    chat: RoomMessage[];
}
