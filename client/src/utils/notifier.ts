import {writable} from 'svelte/store';

/**
 * Notification item data
 */
type notification = {
    id?: string;
    status: 'success' | 'error';
    title?: string;
    message?: string;
};

/**
 * Store for notifications content
 */
const notifier = writable<notification[]>([]);
export default notifier;

/**
 * Append notification to notifications list
 * @param status
 * @param title
 * @param message
 */
function addNotification({ status, title, message }: notification): void {
    notifier.update((items) => {
        const id = 'x'.repeat(16).replaceAll(
            /x/g,
            () => Math.floor(Math.random() * 9).toString()
        );
        items.push({id, status, title, message});
        setTimeout(() => {
            notifier.update((_i) => _i.filter(item => item.id !== id));
        }, 4000);

        return items;
    });
}

/**
 * Notifier functions
 */
export const notify = {
    success: (data: { title?: string, message?: string }) => addNotification({
        status: 'success',
        ...data
    }),
    error: (data: { title?: string, message?: string }) => addNotification({
        status: 'error',
        ...data
    })
};
