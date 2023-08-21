import {writable} from 'svelte/store';

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
    members?: string[];

} | null>(null);
