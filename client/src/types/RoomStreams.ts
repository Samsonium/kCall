/**
 * Connected users stream
 */
export default interface RoomStreams {
    [uid: string]: MediaStream;
}
