import {notify} from './notifier';

/**
 * Generate invitation link and copy
 */
export default function getInvitationLink(): void {
    const resultURL = new URL('https://k-call.ru/');

    const path = decodeURIComponent(location.pathname).split('/').slice(2).join('/');
    if (path.startsWith('web+kcall://'))
        resultURL.pathname = '/room/' + path.substring(path.indexOf('://') + 3);
    else resultURL.pathname = path;

    if (!window?.navigator?.clipboard?.writeText) {
        notify.error({
            title: 'Ошибка!',
            message: 'Не удалось скопировать пригласительную ссылку'
        });
    } else {
        navigator.clipboard.writeText(resultURL.toString()).then(() => notify.success({
            title: 'Готово!',
            message: 'Ссылка скопирована в буфер'
        }));
    }
}
