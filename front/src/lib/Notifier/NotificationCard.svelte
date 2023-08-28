<script lang="ts">
    import {Warning, Check} from 'phosphor-svelte';

    export let id: string = '';
    export let type: 'success' | 'error' = 'error';
    export let header = 'Header';
    export let message = '';
</script>

<div class="notification-card" {id}>
    <div class="icon {type}">
        {#if type === 'success'}
            <Check weight="bold" color="white" size={24} />
        {:else}
            <Warning weight="bold" color="white" size={24} />
        {/if}
    </div>
    <div class="text">
        {#if header}
            <h1>{header}</h1>
        {/if}
        {#if message}
            <p>{message}</p>
        {/if}
    </div>
</div>

<style lang="scss">
    .notification-card {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: flex-start;
      background: #2f333a;
      padding: 8px;
      border-radius: 8px;
      margin-top: 8px;

      .text {
        flex: 1;
        display: flex;
        flex-flow: column;
        align-items: flex-start;
        padding: 0 16px;

        & > *:nth-child(2) {
          margin: 8px 0 0;
        }

        h1 {
          font: 700 18px Inter, Roboto, sans-serif;
          color: white;
          padding: 0;
          margin: 0;
        }

        p {
          font: 400 14px Inter, Roboto, sans-serif;
          color: rgba(white, .75);
          padding: 0;
        }
      }

      .icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;

        &.success {
          background: #7ba82e;
        }

        &.error {
          background: #b42c2c;
        }
      }
    }
</style>
