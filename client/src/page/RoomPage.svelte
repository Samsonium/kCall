<script lang="ts">
    import {onMount} from 'svelte';
    import {fade} from 'svelte/transition';
    import type StreamOptions from '../types/StreamOptions';
    import Prebath from './room/Prebath.svelte';
    import Meet from './room/Meet.svelte';
    import Room from './room/Room.svelte';

    /**
     * Path parameters
     */
    export let pathParams: Record<string, string> = {};

    /**
     * Display name in room
     */
    let user = '';

    /**
     * User stream options
     */
    let streamOptions: StreamOptions;

    onMount(() => {
        user = localStorage.getItem('last-used-name') ?? '';
    });
</script>

{#if !user && !streamOptions}
    <div class="sub-page" out:fade={{duration:150}}>
        <Meet room={pathParams.id} bind:user />
    </div>
{:else if user && !streamOptions}
    <div class="sub-page" in:fade={{duration:150, delay: 150}} out:fade={{duration:150}}>
        <Prebath {user} room={pathParams.id} bind:streamOptions />
    </div>
{:else}
    <div class="sub-page" in:fade={{duration:150, delay: 150}}>
        <Room {streamOptions} username={user} roomID={pathParams.id} />
    </div>
{/if}

<style lang="scss">
    .sub-page {
      width: 100%;
      height: 100%;
    }
</style>
