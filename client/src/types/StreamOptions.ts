/**
 * User stream options
 */
export default interface StreamOptions {

    /**
     * Whether user stream enabled
     */
    enabled: boolean;

    /**
     * Tracks setup in stream
     */
    tracks?: {
        audio: boolean;
        video: boolean;
    };
}
