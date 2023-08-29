/**
 * Room call member data
 */
export default interface RoomMember {

    /**
     * User unique identifier (peer id)
     */
    uid: string;

    /**
     * User's display name
     */
    name: string;

    /**
     * Outgoing stream tracks options
     */
    streamOptions: {

        /**
         * Is the microphone on
         */
        audio: boolean;

        /**
         * Is the webcam on
         */
        video: boolean;
    };
}
