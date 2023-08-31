<script lang="ts">
    import {onMount} from 'svelte';
    import {slide, fade} from 'svelte/transition';
    import {MicrophoneSlash, GearFine} from 'phosphor-svelte';
    import type StreamOptions from '../../types/StreamOptions';

    export let stream: MediaStream;
    export let name: string;
    export let streamOptions: StreamOptions['tracks'];

    let video: HTMLVideoElement;

    let isSettingsOpen = false;

    const color = [
        '#8783D1',
        '#34623F',
        '#B39C4D',
        '#FF312E',
        '#540D6E',
        '#0EAD69',
        '#3BCEAC',
        '#EE4266',
        '#E77728',
        '#EDB230',
        '#587792',
        '#C6C013',
        '#008148',
        '#034732',
        '#5C5D67',
        '#A68BA5',
    ][Math.floor(Math.random() * 16)];

    function handleSoundChange(e: Event): void {
        if (!video) return;
        e.preventDefault();
        video.volume = parseInt((e.target as HTMLInputElement).value);
    }

    onMount(() => {
        if (!stream || !name || !streamOptions || !video) return;

        video.srcObject = stream;
        video.muted = !streamOptions.video;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        }, {once: true});
    });
</script>

<div class="video">
    <video bind:this={video} muted></video>
    {#if !streamOptions.video}
        <div class="no-video-overlay" transition:fade={{duration: 200}}>
            <div class="circle" style="background: {color}">
                {name?.substring(0, 2)?.toUpperCase() ?? '?'}
            </div>
        </div>
    {/if}

    <div class="overlay">
        {#if isSettingsOpen}
            <div class="settings-box" transition:slide={{duration: 200}}>
                <div class="settings">
                    <input type="range" min="0"
                           max="1" step="0.01"
                           value={video?.volume ?? 1}
                           on:change={handleSoundChange}>
                </div>
            </div>
        {/if}
        <div class="panel">
            <div class="name">
                {#if !streamOptions.audio}
                    <div class="microphone-off" transition:slide={{duration: 150, axis: 'x'}}>
                        <MicrophoneSlash size={24} color="black" weight="bold" />
                    </div>
                {/if}
                <p>{name}</p>
            </div>
            <button class="secondary" on:click={() => isSettingsOpen = !isSettingsOpen}>
                <GearFine size={24} color="white" weight="bold" />
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    .video {
      position: relative;
      z-index: 5;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(white, .5);
      border-radius: var(--round-l);
      overflow: hidden;

      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1);
      }

      .no-video-overlay {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(black, .5);
        display: flex;
        align-items: center;
        justify-content: center;

        .circle {
          width: 150px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          font: 700 64px Inter, Roboto, sans-serif;
          color: white;
          border-radius: 75px;
        }
      }

      .overlay {
        position: absolute;
        z-index: 3;
        left: 8px;
        right: 16px;
        bottom: 8px;
        display: flex;
        flex-flow: column;

        .settings-box {
          opacity: 0;
          align-self: flex-end;
          background: var(--panel);
          padding: 16px;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          border-bottom-left-radius: 16px;
          transition: opacity .2s cubic-bezier(.25, 0, 0, 1);
        }

        .panel {
          width: 100%;
          height: 50px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;

          .name {
            width: max-content;
            height: 48px;
            padding: 8px 12px;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            background: var(--panel);
            border-radius: 16px;

            .microphone-off {
              width: 32px;
              height: 32px;
              padding: 4px;
              background: white;
              margin-right: 8px;
              border-radius: 16px;
            }
          }

          .secondary {
            width: 48px;
            height: 48px;
            padding: 4px;
            opacity: 0;
            transition: opacity .2s cubic-bezier(.25, 0, 0, 1);
          }
        }
      }

      &:hover {
        .secondary {
          opacity: 1 !important;
        }

        .settings-box {
          opacity: 1 !important;
        }
      }
    }
</style>
