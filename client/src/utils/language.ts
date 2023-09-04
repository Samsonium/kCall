import {writable} from 'svelte/store';

type Language = 'ru' | 'en';

const value = localStorage.getItem('language') ?? 'ru';
const language = writable<Language>(value as Language);
export default language;
