<script lang="ts">
  import Router from './lib/Router.svelte';
  import Notifier from './ui/Notifier.svelte';
  import routes from './routes';
  import {onMount} from 'svelte';

  onMount(() => {
      if (navigator?.registerProtocolHandler)
          navigator.registerProtocolHandler('web+kcall', '/room/%s');

      const path = decodeURIComponent(location.pathname);
      if (path.includes('room/web+kcall://')) {
          const decoded = decodeURIComponent(location.pathname)
          const id = decoded.substring(decoded.indexOf('://') + 3);
          location.href = '/room/' + id;
      }
  });
</script>

<Notifier />
<div class="page">
    <Router {routes} />
</div>

<style lang="scss">
    .page {
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
</style>
