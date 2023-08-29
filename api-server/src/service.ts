import logger from './logger';
import roomsStore from './store';
import type {RoomData, RoomMember, RoomMessage} from 'tools/types/types';

/**
 * Join room
 * @param room Room ID
 * @param metadata room member data
 */
export function joinRoom(room: string, metadata: RoomMember): RoomData {
    if (!roomsStore.has(room)) roomsStore.set(room, {
        id: room,
        chat: [],
        members: []
    });

    // Read room data
    const data = roomsStore.get(room);
    data.members.push(metadata);
    return data;
}

/**
 * Send message to room chat
 * @param room Room ID
 * @param uid User ID
 * @param text Text of the message
 */
export function sendMessage(room: string, uid: string, text: string): RoomMessage {
    if (!roomsStore.has(room)) return;

    // Read room data and push the message
    const message = {uid, text};
    roomsStore.get(room).chat.push(message);
    return message;
}

/**
 * User stream changed event
 * @param room Room ID
 * @param uid User ID
 * @param type Type of changed track
 * @param value Current state
 */
export function changeStream(room: string, uid: string, type: 'audio' | 'video', value: boolean): RoomData {
    if (!roomsStore.has(room)) return;

    // Search for a member
    const data = roomsStore.get(room);
    const member = data.members.find((member) => member.uid === uid);

    // Check is member exists
    if (!member) {
        logger.error('Unknown user ' + uid + ' in room ' + room);
        return;
    }

    // Change track stream track state
    switch (type) {
        case 'audio':
            member.streamOptions.audio = value;
            break;

        case 'video':
            member.streamOptions.video = value;
            break;
    }

    return data;
}

/**
 * User leave event
 * @param room Room ID
 * @param uid User ID
 */
export function leaveRoom(room: string, uid: string): void {
    if (!roomsStore.has(room)) return;

    // Read room data and find for member index in members array
    const data = roomsStore.get(room);
    const memberIndex = data.members.findIndex((member) => member.uid === uid);

    // Check index
    if (memberIndex === -1) {
        logger.warn('User ' + uid + ' not found or already leaved room ' + room);
        return;
    }

    data.members.splice(memberIndex, 1);
}
