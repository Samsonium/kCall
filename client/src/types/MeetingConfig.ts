import type StreamOptions from './StreamOptions';

/**
 * Initial fields for Meeting class
 */
export default interface MeetingConfig {

    /**
     * Room identifier
     */
    roomID: string;

    /**
     * User's display name
     */
    displayName: string;

    /**
     * Initial stream options
     */
    streamOptions: StreamOptions;
}
