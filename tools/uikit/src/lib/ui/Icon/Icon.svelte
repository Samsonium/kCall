<script lang="ts">
    import iconsList from '$lib/ui/Icon/iconsList.js';
    import {onMount} from 'svelte';

    /** Icon name */
    export let name: string;

    /** Icon size */
    export let size = 24;

    /** Icon weight */
    export let weight: 'light' | 'regular' | 'bold' | 'fill' = 'bold';

    /** Icon color */
    export let color = 'black';

    onMount(() => {
    	if (!name) name = 'at';
    });
</script>

<svelte:component this={iconsList[name]} {size} {weight} />
