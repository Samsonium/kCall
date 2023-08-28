/**
 * Room member stream reference
 */
export default interface MemberStreams {
    [userID: string]: {
        /**
         * User peer identifier
         */
        peerID: string;

        /**
         * Member's stream
         */
        stream?: MediaStream;
    }
}
