<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import {slide, fade} from 'svelte/transition';
    import {GearSix, X, MicrophoneSlash} from 'phosphor-svelte';

    export let stream: MediaStream;
    export let name: string;
    export let streamSettings: {
        isAudioEnabled: boolean;
        isVideoEnabled: boolean;
    } = {
        isAudioEnabled: false,
        isVideoEnabled: false
    };

    /**
     * Video element for stream
     */
    let video: HTMLVideoElement;

    /**
     * Whether to show popup with settings
     */
    let isShowingSettings = false;

    onMount(() => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
            video.muted = false;
        });
    });

    onDestroy(() => {
        video.remove();
    });
</script>

<div class="video-box" class:talking={isTalking}>
    {#if !streamSettings.isVideoEnabled}
        <div class="placeholder" transition:fade={{duration: 200}}>
            <div class="circle" style="background: {color}">
                {name.substring(0, 2)}
            </div>
        </div>
    {/if}
    <video bind:this={video} muted></video>
    <div class="controls">
        <div class="name">
            {#if !streamSettings.isAudioEnabled}
                <div class="icon" transition:slide={{duration:200}}>
                    <MicrophoneSlash color="white" weight="bold" size={24} />
                </div>
            {/if}
            {name}
        </div>
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
      max-width: 1000px;
      width: 100%;
      min-width: 350px;
      height: fit-content;
      aspect-ratio: 4 / 3;
      border-radius: 16px;
      overflow: hidden;
      margin: 8px;
      background: black;
      transition: outline .2s cubic-bezier(.25, 0, 0, 1);

      &.talking {
        outline: 4px solid #167bff;
      }

      :global(video) {
        width: 100%;
        transform: scaleX(-1);
      }

      div.placeholder {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(black, .5);

        div.circle {
          width: 128px;
          height: 128px;
          display: flex;
          align-items: center;
          justify-content: center;
          font: 700 64px Inter, Roboto, sans-serif;
          color: white;
          border-radius: 64px;
        }
      }

      div.settings {
        position: absolute;
        z-index: 3;
        right: 16px;
        bottom: 64px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(white, .5);
        border-radius: 16px 16px 0 16px;
        background: rgba(black, .5);
        backdrop-filter: blur(8px);

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

        div.name {
          width: max-content;
          height: 40px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          font: 800 16px Inter, Roboto, sans-serif;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, .5);
          background: #21272d;
          border-radius: 16px;
          padding: 0 16px;

          .icon {
            margin-right: 8px;
          }
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
