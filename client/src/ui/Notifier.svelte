<script lang="ts">
    import {slide} from 'svelte/transition';
    import {cubicInOut} from 'svelte/easing';
    import notifier from '../utils/notifier';
    import {Warning, Check} from 'phosphor-svelte';
</script>

<div class="notifier">
    {#each $notifier as not}
        <div class="notification {not.status}" transition:slide={{duration: 150, easing: cubicInOut}}>
            <div class="icon">
                <svelte:component
                        this={not.status === 'success' ? Check : Warning}
                        size={24}
                        color="var(--white)"
                        weight="bold"
                />
            </div>
            <div class="text">
                {#if not.title && not.message}
                    <span class="title">{not.title}</span>
                    <span class="message">{not.message}</span>
                {:else}
                    <span class="message">{not.title ?? not.message}</span>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    .notifier {
      position: fixed;
      z-index: 200;
      bottom: 0;
      right: 0;
      width: 100%;
      max-width: 350px;
      padding: 0 16px 16px 16px;
      display: flex;
      flex-flow: column;
      align-items: stretch;

      .notification {
        width: 100%;
        padding: 16px;
        margin-top: 8px;
        border-radius: var(--round-l);
        background: var(--panel);
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-start;

        .icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text {
          flex: 1;
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          margin-left: 16px;

          * {
            padding: 0;
            margin: 0;
            font-family: Inter, Roboto, sans-serif;
            color: white;
          }

          *:nth-child(2) {
            margin-top: 8px;
          }

          .title {
            font-weight: 700;
            font-size: 16px;
          }

          .message {
            font-weight: 400;
            font-size: 14px;
            opacity: .75;
          }
        }

        &.success {
          .icon {
            background: var(--success);
          }
        }

        &.error {
          .icon {
            background: var(--error);
          }
        }
      }
    }
</style>
