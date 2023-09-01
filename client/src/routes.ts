import HomePage from './page/HomePage.svelte';
import RoomPage from './page/RoomPage.svelte';
import type {SvelteComponent} from 'svelte';

const routes: Record<string, typeof SvelteComponent> = {
    '/': HomePage,
    '/room/:id': RoomPage
};

export default routes;
