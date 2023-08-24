<script lang="ts">
    import {onMount} from 'svelte';
    import {slide} from 'svelte/transition';
    import {GearSix} from 'phosphor-svelte';

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
        <button class="settings">
            <GearSix color="white" weight="bold" size={32} />
        </button>
    </div>

    {#if isShowingSettings}
        <div class="settings" transition:slide={{duration:200}}>
            <label for="volume">Громкость</label>
            <input id="volume" type="range" min="0" max="1.5" step=".1">
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
        height: 100%;
        object-fit: cover;
      }

      .controls {
        position: absolute;
        z-index: 1;
        bottom: 8px;
        padding: 0 16px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;

        p {
          font: 500 16px Inter, Roboto, sans-serif;
          color: white;
          text-shadow: 0 4px 8px rgba(0, 0, 0, .5);
        }

        button.settings {
          opacity: 0;
          width: 32px;
          height: 32px;
          background: rgba(white, .25);
          backdrop-filter: blur(4px);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(black, .1);
          transition: opacity .2s cubic-bezier(.25, 0, 0, 1);
        }
      }

      &:hover {
        button.settings {
          opacity: 1;
        }
      }
    }
</style>
