<script lang="ts">
    import {roomInfo, streamInfo} from '../utils/store';
    import {onDestroy, onMount} from 'svelte';
    import {slide} from 'svelte/transition';
    import {SignOut, Microphone, Webcam, Share} from 'phosphor-svelte';
    import Notification from '../utils/Notification';
    import RoomCall from '../utils/RoomCall';

    import type {Writable} from 'svelte/store';
    import type MemberStreams from '../utils/MemberStreams';
    import type RoomData from '../../../types/RoomData';
    import VideoGrid from './Room/VideoGrid.svelte';

    /**
     * Room call class
     */
    const roomCall = new RoomCall();

    /**
     * Local stream
     */
    let selfStream: Writable<MediaStream>;

    /**
     * Video element for local stream
     */
    let selfVideo: HTMLVideoElement;

    /**
     * Video track enable state
     */
    let isVideoEnabled = $streamInfo.video
    $: changeTrack('video', isVideoEnabled)

    /**
     * Audio track enable state
     */
    let isAudioEnabled = $streamInfo.audio
    $: changeTrack('audio', isAudioEnabled)

    $: if ($selfStream && selfVideo) {
        selfVideo.pause();
        selfVideo.srcObject = $selfStream;
        selfVideo.addEventListener('loadedmetadata', () => selfVideo.play());
    }

    onMount(async () => {
        selfStream = roomCall.selfStream;

        await roomCall.startCall();
    });

    onDestroy(() => {
        roomCall.endCall();
    })

    /** Chat */
    let chat = [];
    $: if ($roomInfo.chat) chat = $roomInfo.chat;

    /** Typing typingMessage value */
    let typingMessage = ''

    /**
     * Change track enable status
     * @param type
     * @param value
     */
    function changeTrack(type: 'audio' | 'video', value: boolean): void {
        if (roomCall) roomCall.changeTrack(type, value);
    }

    /**
     * Copy invitation link to clipboard
     */
    function copyLink() {
        const protocol = location.protocol;
        const host = location.host;
        const room = $roomInfo.id;
        navigator.clipboard.writeText(`${protocol}//${host}/?room=${room}`).then(() => {
            Notification.send(Notification.Type.Success, 'Готово!', 'Ссылка успешно скопирована');
        }).catch(() => {
            Notification.send(Notification.Type.Error, 'Ошибка!', 'Не удалось скопировать ссылку');
        });
    }

    /**
     * Leave the room
     */
    function leaveRoom() {
        $roomInfo = null;
        location.search = '';
    }

    /**
     * Send typingMessage to the room
     */
    function sendMessage() {
        roomCall.sendMessage(typingMessage);
        typingMessage = '';
    }
</script>

<div class="room">
    <div class="header">
        <h3>
            {$roomInfo.id}
        </h3>
        <div style="display:flex;flex-flow:row nowrap">
            <button class="share" on:click={copyLink.bind(this)}>
                <Share size={24} color="white" weight="bold" />
            </button>
            <button class="exit" on:click={leaveRoom}>
                <SignOut size={24} color="white" weight="bold" />
                <span class="on-pc">Отключиться</span>
            </button>
        </div>
    </div>
    <div class="video-box">
        <VideoGrid memberStreams={roomCall.membersStreams} />
        <div class="self-video">
            <video bind:this={selfVideo} muted></video>
            <div class="controls">
                <button class="control"
                        class:disabled={!isAudioEnabled}
                        on:click={() => isAudioEnabled = !isAudioEnabled}>
                    <Microphone weight="bold" size={24} color={isAudioEnabled ? 'white' : 'orangered'} />
                </button>
                <button class="control"
                        class:disabled={!isVideoEnabled}
                        on:click={() => isVideoEnabled = !isVideoEnabled}>
                    <Webcam weight="bold" size={24} color={isVideoEnabled ? 'white' : 'orangered'} />
                </button>
            </div>
        </div>
    </div>
    <div class="chat-box">
        <div class="history">
            <div class="history-scrollable">
                {#each chat as message}
                    {#if message?.message?.trim()}
                        <div class="chat-message" transition:slide={{duration:150}}>
                            <div class="username">{message.name}</div>
                            <div class="message">{message.message}</div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
        <form class="field" on:submit|preventDefault={sendMessage}>
            <input type="text" minlength="1" maxlength="256" placeholder="Сообщение" bind:value={typingMessage}>
            <button type="submit" class="send">Отправить</button>
        </form>
    </div>
</div>

<style lang="scss">
    .room {
      width: 100%;
      height: 100%;
      max-height: 100%;
      display: grid;
      grid-template-columns: 1fr minmax(auto, 500px);
      grid-template-rows: 64px 1fr;
      background: #1c1f23;

      .header {
        height: 64px;
        padding: 0 16px;
        display: flex;
        grid-column-start: 1;
        grid-column-end: col2-end;
        grid-row: 1;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(white, .15);

        h3 {
          font: 700 16px Inter, Roboto, sans-serif;
          color: white;
          padding: 0;
          margin: 0;
        }

        button.exit {
          padding: 8px 16px;
          background: #ff4040;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          font: 500 14px Inter, Roboto, sans-serif;
          transition: background .2s cubic-bezier(.25, 0, 0, 1);

          span.on-pc {
            display: inline-block;
            margin-left: 8px;
          }

          &:hover {
            background: #b42c2c;
          }
        }

        button.share {
          padding: 8px;
          background: #167bff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-right: 8px;

          &:hover {
            background: #1355a9;
          }
        }
      }

      .video-box {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 10;
        grid-column: 1;
        grid-row: 2;

        .self-video {
          position: fixed;
          z-index: 9;
          bottom: 16px;
          left: 16px;
          height: 200px;
          max-width: calc(100vw - 32px);
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(#167bff, .25);

          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scaleX(-1);
          }

          .controls {
            position: absolute;
            z-index: 8;
            left: 8px;
            right: 8px;
            bottom: 8px;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: center;

            button.control {
              width: 32px;
              height: 32px;
              border-radius: 16px;
              padding: 0;
              background: rgba(black, .5);
              backdrop-filter: blur(8px);
              border: none;
              margin: 0 4px;
              cursor: pointer;
              transition: transform .2s cubic-bezier(.25, 0, 0, 1),
                          background .2s cubic-bezier(.25, 0, 0, 1);

              &:hover {
                transform: scale(1.05);
              }

              &:active {
                transform: scale(.95);
              }

              &.disabled {
                background: rgba(mix(orangered, black, .5), .25);
              }
            }
          }
        }
      }

      .chat-box {
        max-height: calc(100vh - 64px);
        grid-column: 2;
        grid-row: 2;
        display: flex;
        flex-flow: column;
        align-items: stretch;
        border-left: 1px solid rgba(white, .15);

        .history {
          flex: 1;
          overflow: hidden;

          .history-scrollable {
            overflow-x: hidden;
            overflow-y: auto;
            padding: 12px;
            width: 100%;
            height: 100%;

            &::-webkit-scrollbar {
              width: 10px;
            }

            &::-webkit-scrollbar-track {
              background: rgba(white, .05);
            }

            &::-webkit-scrollbar-thumb {
              background: rgba(#167bff, .5);
              cursor: pointer;
              border-radius: 12px;

              &:hover, &:active {
                background: #167bff;
              }
            }
          }

          .chat-message {
            width: 100%;
            height: max-content;
            padding: 12px;
            background: #21272d;
            font: 400 16px Inter, Roboto, sans-serif;
            color: white;
            border-radius: 16px;
            border: 1px solid rgba(white, .15);

            .username {
              width: max-content;
              padding: 4px 8px;
              background: white;
              border-radius: 12px;
              color: #167bff;
              font: 500 12px Inter, Roboto, sans-serif;
              margin-bottom: 8px;
            }

            &:not(:last-child) {
              margin-bottom: 8px;
            }
          }
        }

        .field {
          height: 48px;
          padding: 16px 12px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;

          input {
            flex: 1;
            height: 32px;
            border-radius: 8px;
            border: 1px solid rgba(white, .15);
            color: white;
            background: #1c1f23;
            padding: 0 12px;
            margin-right: 8px;
          }

          button.send {
            height: 32px;
            font: 500 14px Inter, Roboto, sans-serif;
            color: white;
            background: #167bff;
            cursor: pointer;
            border-radius: 8px;
            border: none;
            transition: background .2s cubic-bezier(.25, 0, 0, 1);

            &:hover {
              background: #1355a9;
            }
          }
        }
      }
    }

    @media only screen and (max-width: 750px) {
      .on-pc {
        display: none !important;
      }

      .chat-box {
        display: none !important;
      }
    }
</style>
