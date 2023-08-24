<script lang="ts">
    import {onMount} from 'svelte';
    import {slide} from 'svelte/transition';
    import {GearSix, X} from 'phosphor-svelte';

    /**
     * Video element
     */
    export let video: HTMLVideoElement;

    /**
     * Username
     */
    export let name: string;

    /**
     * Box for video element
     */
    let videoBox: HTMLDivElement;

    /**
     * Whether to show popup with settings
     */
    let isShowingSettings = false;

    onMount(() => videoBox.append(video));
</script>

<div bind:this={videoBox} class="video-box">
    <div class="controls">
        <p>{name}</p>
        <button class="settings" on:click={() => isShowingSettings = !isShowingSettings}>
            {#if isShowingSettings}
                <X color="white" weight="bold" size={32} />
            {:else}
                <GearSix color="white" weight="bold" size={32} />
            {/if}
        </button>
    </div>

    {#if isShowingSettings}
        <div class="settings" transition:slide={{duration:200}}>
            <div class="form">
                <label for="volume">Громкость</label>
                <input id="volume" type="range" min="0" max="1.5" step=".1" bind:value={video.volume}>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .video-box {
      position: relative;
      z-index: 3;
      flex: 1;
      max-width: 100%;
      min-width: 350px;
      height: fit-content;
      border-radius: 16px;
      overflow: hidden;
      margin: 8px;

      :global(video) {
        width: 100%;
      }

      div.settings {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        bottom: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(black, .5);
        backdrop-filter: blur(8px);
        border-bottom: 2px solid rgba(white, .5);

        .form {
          width: 100%;
          max-width: 300px;
          display: flex;
          flex-flow: column;
          align-items: stretch;

          label {
            font: 500 16px Inter, Roboto, sans-serif;
            color: white;
            padding: 0;
            margin: 0 8px;
          }

          input {
            padding: 4px 8px;
            background: white;
            border-radius: 16px;
          }
        }
      }

      .controls {
        position: absolute;
        z-index: 1;
        left: 0;
        right: 0;
        bottom: 8px;
        padding: 0 16px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;

        p {
          font: 800 16px Inter, Roboto, sans-serif;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, .5);
        }

        button.settings {
          opacity: 0;
          width: 48px;
          height: 48px;
          border: none;
          background: rgba(black, .25);
          backdrop-filter: blur(4px);
          border-radius: 16px;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(black, .1);
          transition: opacity .2s cubic-bezier(.25, 0, 0, 1),
                      outline .2s cubic-bezier(.25, 0, 0, 1);

          &:hover {
            outline: 4px solid white;
          }
        }
      }

      &:hover, &:has(div.settings) {
        button.settings {
          opacity: 1;
        }
      }
    }
</style>
