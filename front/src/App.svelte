<script lang="ts">
  import {onMount} from 'svelte';
  import {roomInfo} from './utils/store';
  import Room from './lib/Room.svelte';
  import Lobby from './lib/Lobby.svelte';

  onMount(() => {
    const params = new URLSearchParams(location.search);

    roomInfo.set({
      connected: false,
      id: params.get('room'),
      user: params.get('user')
    });

    console.log($roomInfo);
  });
</script>

<main>
  {#if $roomInfo}
    <Room/>
  {:else}
    <Lobby/>
  {/if}
</main>

<style lang="scss">
  main {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
