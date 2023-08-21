<script lang="ts">
    import {onMount} from 'svelte';
    import {roomInfo, streamInfo} from '../utils/store';

    let video: HTMLVideoElement;
    let stream: MediaStream;

    let isVideoEnabled = true;
    $: changeTrack('video', isVideoEnabled);

    let isAudioEnabled = true;
    $: changeTrack('audio', isAudioEnabled);

    onMount(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((_stream: MediaStream) => {
            stream = _stream;
            video.srcObject = _stream;
            video.muted = false;
            video.addEventListener('loadedmetadata', () => video.play());
        })
    });

    function changeTrack(type: 'audio' | 'video', value: boolean): void {
        if (!stream) return;
        for (const track of stream.getTracks()) {
            if (track.kind !== type) continue;
            track.enabled = value;
        }
    }

    function joinRoom() {
        $streamInfo.audio = isAudioEnabled;
        $streamInfo.video = isVideoEnabled;
        $roomInfo.ready = true;
    }
</script>

<div class="page">
    <div class="prebath">
        <h3>Подготовка к встрече</h3>
        <video bind:this={video}></video>
        <div class="controls">
            <button class="control-button"
                    class:disabled={!isAudioEnabled}
                    on:click={() => isAudioEnabled = !isAudioEnabled}>
                Микрофон
            </button>
            <button class="control-button"
                    class:disabled={!isVideoEnabled}
                    on:click={() => isVideoEnabled = !isVideoEnabled}>
                Видео
            </button>
        </div>
        <button class="start" on:click={joinRoom}>Начать встречу</button>
    </div>
</div>

<style lang="scss">
  .prebath {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;

    h3 {
      width: max-content;
      padding: 0;
      font: 700 16px Inter, Roboto, sans-serif;
      color: black;
      margin: 0 0 16px;
    }

    video {
      width: 100%;
      max-width: 500px;
      margin: 0 16px;
      aspect-ratio: 16 / 9;
      border-radius: 16px;
      object-fit: cover;
      transform: scaleX(-1);
      background: black;
    }

    .controls {
      width: 100%;
      max-width: 500px;
      margin: 16px;
      display: flex;
      flex-flow: row nowrap;

      button.control-button {
        flex: 1;
        height: 32px;
        background: #efefef;
        cursor: pointer;
        border: 1px solid #dfdfdf;
        transition: background .2s cubic-bezier(.25, 0, 0, 1),
                    opacity .2s cubic-bezier(.25, 0, 0, 1);

        &.disabled {
          opacity: .5;
        }

        &:first-child {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        &:last-child {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        &:hover {
          background: #dfdfdf;
        }
      }
    }

    button.start {
      width: 100%;
      max-width: 500px;
      margin: 0 16px;
      height: 48px;
      background: #167bff;
      cursor: pointer;
      color: white;
      font: 500 16px Inter, Roboto, sans-serif;
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(#167bff, .25);
      transition: all .2s cubic-bezier(.25, 0, 0, 1);

      &:hover {
        transform: scale(1.02);
        background: #1355a9;
      }

      &:active {
        transform: scale(.99);
      }
    }
  }

</style>
