import {writable} from 'svelte/store';
import type {MediaConnection} from 'peerjs';
import type RoomData from '../../../types/RoomData';

export const roomInfo = writable<{

    /** Room ID */
    id: string;

    /** Username */
    user: string;

    /**
     * Is user connected
     */
    ready: boolean;

    /** Room chat */
    chat?: {
        name: string;
        message: string;
    }[];

    /** Users list */
    members?: {
        [id: string]: MediaConnection
    };

} | null>(null);

export const streamInfo = writable<{
    audio: boolean,
    video: boolean
}>({
    video: true,
    audio: true
});

export const room = writable<RoomData>({
    chat: [],
    members: []
});
