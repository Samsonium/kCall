import {get} from 'svelte/store';
import language from './language';
import type I18NDictionary from '../types/I18NDictionary';

export default function i18n(...dictionaries: I18NDictionary[]): (key: string) => string {
    const resultDict: I18NDictionary = {};
    for (const dict of dictionaries) {
        for (const lang in dict) {
            resultDict[lang] = Object.assign({}, resultDict[lang] ?? {}, dict[lang]);
        }
    }
    return (key) => resultDict[get(language)]?.[key] ?? 'no_i18n';
}
