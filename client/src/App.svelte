<script lang="ts">
  import Router from './lib/Router.svelte';
  import routes from './routes';
</script>

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
