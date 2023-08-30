import HomePage from './page/HomePage.svelte';
import RoomPage from './page/RoomPage.svelte';
import NotFoundPage from './page/NotFoundPage.svelte';
import type {SvelteComponent} from 'svelte';

const routes: Record<string, typeof SvelteComponent> = {
    '/': HomePage,
    '/room/:id': RoomPage,
    '*': NotFoundPage
};

export default routes;
