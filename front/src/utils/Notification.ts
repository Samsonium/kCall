import {writable} from 'svelte/store';

/**
 * Notification type
 */
enum Type {
    Success = 'success',
    Error = 'error'
}

export default class Notification {
    public static store = writable<{
        id: string;
        type: string;
        header: string;
        message?: string;
    }[]>([]);

    public static Type = Type;

    /**
     * Send success notification
     * @param type
     * @param header
     * @param message
     */
    public static send(type: Type, header: string, message?: string): void {
        const id = 'xxxx'.replaceAll(
            /x/g,
            () => Math.floor(Math.random() * 9).toString()
        );

        // Add notification to display list
        Notification.store.update((items) => [...items, {
            id, type, header, message
        }]);

        // Set clear timeout
        setTimeout(() => {
            Notification.store.update((items) => {
                items.splice(
                    items.findIndex((item) => item.id === id),
                    1
                );
                return items;
            })
        }, 3000);
    }
}
