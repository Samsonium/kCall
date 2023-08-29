import HomePage from './page/HomePage.svelte';
import RoomPage from './page/RoomPage.svelte';
import NotFoundPage from './page/NotFoundPage.svelte';

const routes: {}[]= [
    {
        name: '/',
        component: HomePage
    },
    {
        name: '/room/:id',
        component: RoomPage
    },
    {
        name: '*',
        component: NotFoundPage
    }
];
export default routes;
