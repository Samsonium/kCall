import {notify} from './notifier';

/**
 * Generate invitation link and copy
 */
export default function getInvitationLink(): void {
    const url = new URL(location.toString());
    url.hash = '';

    if (!window?.navigator?.clipboard?.writeText) {
        notify.error({
            title: 'Ошибка!',
            message: 'Не удалось скопировать пригласительную ссылку'
        });
    } else {
        navigator.clipboard.writeText(url.toString()).then(() => notify.success({
            title: 'Готово!',
            message: 'Ссылка скопирована в буфер'
        }));
    }
}
