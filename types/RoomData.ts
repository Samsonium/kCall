/**
 * Room metadata
 */
export default interface RoomData {
    /**
     * Messages
     */
    chat: {
        /**
         * Username
         */
        name: string;

        /**
         * Sent typingMessage contents
         */
        message: string;
    }[];

    members: {
        /**
         * User socket identifier
         */
        userID: string;

        /**
         * User peer identifier
         */
        peerID?: string;

        /**
         * Display name of the user
         */
        displayName: string;

        /**
         * Stream parameters
         */
        stream: {
            /**
             * Is audio track enabled
             */
            isAudioEnabled: boolean;

            /**
             * Is video track enabled
             */
            isVideoEnabled: boolean;
        };
    }[];
}
