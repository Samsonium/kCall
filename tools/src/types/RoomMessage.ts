/**
 * Room call message
 */
export default interface RoomMessage {

    /**
     * Sender identifier (peer id)
     */
    uid: string;

    /**
     * Text of the message
     */
    text: string;
}
