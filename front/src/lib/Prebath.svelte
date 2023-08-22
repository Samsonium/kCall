<script lang="ts">
    import {onMount} from 'svelte';
    import {roomInfo, streamInfo} from '../utils/store';

    import {Microphone, Webcam} from 'phosphor-svelte';

    let video: HTMLVideoElement;
    let stream: MediaStream;

    let isVideoEnabled = true;
    $: changeTrack('video', isVideoEnabled);

    let isAudioEnabled = true;

    onMount(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then((_stream: MediaStream) => {
            stream = _stream;
            video.srcObject = _stream;
            video.muted = true;
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
            <button class="start" on:click={joinRoom}>Начать встречу</button>
            <button class="control-button"
                    class:disabled={!isAudioEnabled}
                    on:click={() => isAudioEnabled = !isAudioEnabled}>
                <Microphone weight="bold" color="{isAudioEnabled ? 'limegreen' : 'orangered'}" size={24} />
            </button>
            <button class="control-button"
                    class:disabled={!isVideoEnabled}
                    on:click={() => isVideoEnabled = !isVideoEnabled}>
                <Webcam weight="bold" color="{isVideoEnabled ? 'limegreen' : 'orangered'}" size={24} />
            </button>
        </div>
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
        width: 48px;
        height: 48px;
        background: #eeffe9;
        cursor: pointer;
        border: 2px solid limegreen;
        border-radius: 16px;
        margin-left: 8px;
        box-shadow: 0 8px 16px rgba(green, .1);
        transition: background .2s cubic-bezier(.25, 0, 0, 1),
                    border .2s cubic-bezier(.25, 0, 0, 1),
                    box-shadow .2s cubic-bezier(.25, 0, 0, 1),
                    transform .2s cubic-bezier(.25, 0, 0, 1);

        &.disabled {
          background: #ffe7e7;
          border-color: orangered;
          box-shadow: 0 8px 16px rgba(red, .1);
        }

        &:hover {
          transform: scale(1.02);
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }

    button.start {
      flex: 1;
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
