<script lang="ts">
    import getInvitationLink from '../../utils/getInvitationLink';
    import {ArrowRight, Microphone, Webcam} from 'phosphor-svelte';
    import type StreamOptions from '../../types/StreamOptions';
    import {onMount} from 'svelte';

    /**
     * Room ID
     */
    export let room: string;

    /**
     * Username
     */
    export let user = 'Имя';

    /**
     * Initial stream options for join room
     */
    export let streamOptions;

    /**
     * User's stream
     */
    let stream: MediaStream;

    /**
     * User video element binding
     */
    let video: HTMLVideoElement;

    /**
     * Hint text if stream disabled
     */
    let hintText = 'Разрешите доступ к камере и микрофону для предпросмотра';

    /**
     * Temporary stream options holder
     */
    export let tempStreamOptions: StreamOptions = {
        enabled: false,
        tracks: {
            audio: true,
            video: true
        }
    };

    function handleSubmitForm(): void {
        streamOptions = tempStreamOptions;
    }

    /**
     * Switch track enable state
     * @param type Track type
     */
    function changeTrack(type: 'video' | 'audio'): void {
        const changedState = !tempStreamOptions.tracks[type];
        tempStreamOptions.tracks[type] = changedState;

        if (!stream) return;

        let track: MediaStreamTrack;
        switch (type) {
            case 'video':
                track = stream.getVideoTracks()[0];
                break;
            case 'audio':
                track = stream.getAudioTracks()[0];
                break;
        }
        track.enabled = changedState;
    }

    onMount(() => {
        if (!navigator?.mediaDevices?.getUserMedia) {
            hintText = 'Невозможно получить доступ к камере и микрофону';
        } else {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    aspectRatio: 4 / 3,
                    facingMode: 'user',
                    width: {
                        max: 500
                    }
                }
            }).then((gottenStream) => {
                if (!video) return;
                video.srcObject = stream = gottenStream;
                video.addEventListener('loadedmetadata', () => video.play(), {
                    once: true
                });

                tempStreamOptions.enabled = true;
            }).catch((err) => {
                console.error(err);
                tempStreamOptions.enabled = false;
            });
        }
    });
</script>

<div class="prebath">
    <h1>Здравствуйте, {user}</h1>
    <p>
        Подготовка ко входу в комнату
        <a href="#generate-link" on:click={getInvitationLink}>{room}</a>
    </p>
    <form on:submit|preventDefault={handleSubmitForm}>
        <div class="video-box">
            <video bind:this={video} muted></video>
            {#if !tempStreamOptions.enabled}
                <div class="hint">
                    <p>{hintText}</p>
                </div>
            {/if}
        </div>
        <div class="button-line">
            <button type="button" class="track"
                    disabled={!tempStreamOptions.enabled}
                    class:off={!tempStreamOptions.tracks.audio}
                    on:click={changeTrack.bind(null, 'audio')}>
                <Microphone size={24} color="white" weight="bold" />
            </button>
            <button type="button" class="track"
                    disabled={!tempStreamOptions.enabled}
                    class:off={!tempStreamOptions.tracks.video}
                    on:click={changeTrack.bind(null, 'video')}>
                <Webcam size={24} color="white" weight="bold" />
            </button>
            <button class="accent">
                <span>Присоединиться</span>
                <ArrowRight size={16} color="white" weight="bold" />
            </button>
        </div>
    </form>
</div>

<style lang="scss">
    .prebath {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      
      h1 {
        text-align: center;
      }

      p {
        margin-bottom: 24px;
        text-align: center;

        a {
          color: white;
          white-space: nowrap;
          text-decoration: underline;
        }
      }

      form {
        width: 100%;
        max-width: 500px;

        .video-box {
          position: relative;
          z-index: 3;
          width: 100%;

          video {
            border-radius: var(--round-l);
            background: black;
            width: 100%;
            aspect-ratio: 4 / 3;
            border: 1px solid rgba(white, .2);
            transform: scaleX(-1);
          }

          .hint {
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px;

            p {
              text-align: center;
            }
          }
        }

        .button-line {
          width: 100%;
          display: flex;
          flex-flow: row nowrap;
          align-items: stretch;
          margin-top: 16px;
          padding: 0 32px;

          button.track {
            height: 100%;
            background: var(--success);
            border: 1px solid rgba(white, .5);
            display: flex;
            margin-right: 8px;
            transition: background .2s cubic-bezier(.25, 0, 0, 1);

            &.off {
              background: var(--error);
            }

            &:disabled {
              background: #ff8000;
              border: rgba(white, .5);
            }
          }

          button.accent {
            flex: 1;
          }
        }
      }
    }

    @media only screen and (max-width: 750px) {
      .button-line {
        padding: 0 !important;

        button {
          height: 42px !important;
        }
      }
    }
</style>
