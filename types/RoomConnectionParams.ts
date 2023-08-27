import RoomData from './RoomData';

/**
 * Member's data
 */
type RoomMemberData = RoomData['members'][number];

/**
 * User metadata on room connection
 */
export default interface RoomConnectionParams extends RoomMemberData {}
