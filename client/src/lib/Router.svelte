<script lang="ts">
    import {onMount, SvelteComponent} from 'svelte';
    import {cubicInOut} from 'svelte/easing';
    import {scale} from 'svelte/transition';
    import Placeholder from './Placeholder.svelte';
    import Preloader from './Preloader.svelte';

    /**
     * Defined routes
     */
    export let routes: Record<string, typeof SvelteComponent> = {};

    /**
     * Page transitions setup
     */
    const animationSetup = {
        easing: cubicInOut,
        duration: 350,
        start: .95
    };

    /**
     * Found page component
     */
    let pageComponent: typeof SvelteComponent | null;

    /**
     * URL search parameters
     */
    let queryParams: Record<string, string> = {};

    /**
     * In-path parameters
     */
    let pathParams: Record<string, string> = {};

    /**
     * Search for requested page
     * @param got
     */
    function validatePath(got: string): void {
        const path = got.split('/').filter(Boolean);
        for (const routeName in routes) {
            if (routeName === '*') {
                pageComponent = routes[routeName];
                return;
            }

            // Split current route path into sections
            const route = routeName.split('/').filter(Boolean);
            if (route.length !== path.length) continue;

            // Validate path and fill path params
            const _pathParams: Record<string, string> = {};

            // Is route found
            let isFound = true;
            for (let i = 0; i < route.length; i++) {
                const routePart = route[i];
                const gotPart = path[i];

                // Parameter request check
                if (routePart.startsWith(':')) {
                    _pathParams[routePart.substring(1)] = gotPart;
                } else if (routePart.toLowerCase() !== gotPart.toLowerCase()) {
                    isFound = false;
                    break;
                }
            }

            // If this route is not matching go to the next iteration
            if (!isFound) continue;

            // Write path params, read search params and set component
            pathParams = _pathParams;
            queryParams = Object.fromEntries(new URLSearchParams(location.search).entries());
            pageComponent = routes[routeName];
            return;
        }

        pageComponent = null;
    }

    onMount(async () => {
        await new Promise(r => setTimeout(r, 700));
        // validatePath(location.pathname);
    })
</script>

{#if pageComponent}
    <div class="page" transition:scale={animationSetup}>
        <svelte:component this={pageComponent} {pathParams} {queryParams}/>
    </div>
{:else if pageComponent === null}
    <div class="page" transition:scale={animationSetup}>
        <Placeholder/>
    </div>
{:else}
    <div class="page" transition:scale={animationSetup}>
        <Preloader/>
    </div>
{/if}

<style lang="scss">
  .page {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg);
  }
</style>
