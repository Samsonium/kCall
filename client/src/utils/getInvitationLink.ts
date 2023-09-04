import {notify} from './notifier';
import i18n from './i18n';
import trLinkGenerator from '../translations/link-generator.json';

const translate = i18n(trLinkGenerator);

/**
 * Generate invitation link and copy
 */
export default function getInvitationLink(): void {
    const resultURL = new URL('https://k-call.ru/');

    const path = decodeURIComponent(location.pathname).split('/').slice(2).join('/');
    if (path.startsWith('web+kcall://'))
        resultURL.pathname = '/room/' + path.substring(path.indexOf('://') + 3);
    else resultURL.pathname = '/room/' + path;

    if (!window?.navigator?.clipboard?.writeText) {
        notify.error({
            title: translate('error_title'),
            message: translate('error_msg')
        });
    } else {
        navigator.clipboard.writeText(resultURL.toString()).then(() => notify.success({
            title: translate('success_title'),
            message: translate('success_msg')
        }));
    }
}
