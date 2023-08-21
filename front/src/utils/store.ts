import {writable} from 'svelte/store';
import type {MediaConnection} from 'peerjs';

export const roomInfo = writable<{

    /** Room ID */
    id: string;

    /** Username */
    user: string;

    /**
     * Is user connected
     */
    connected: boolean;

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
