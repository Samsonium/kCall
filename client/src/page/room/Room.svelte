<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {fade} from 'svelte/transition';
    import getInvitationLink from '../../utils/getInvitationLink';
    import Meeting from '../../utils/meeting';
    import VideoGrid from './VideoGrid.svelte';
    import Preloader from '../../lib/Preloader.svelte';
    import {
        Link,
        SignOut,
        ChatCircle,
        Microphone,
        Webcam,
        Screencast,
        WebcamSlash,
        ArrowClockwise,
        MicrophoneSlash
    } from 'phosphor-svelte';
    import type {RoomData} from 'tools/types/types';
    import type RoomStreams from '../../types/RoomStreams';
    import type {Writable} from 'svelte/store';
    import type StreamOptions from '../../types/StreamOptions';

    /**
     * User identifier
     */
    export let username: string;

    /**
     * Room identifier
     */
    export let roomID: string;

    /**
     * User stream tracks options
     */
    export let streamOptions: StreamOptions;

    const statuses = {
        disconnected: 'Отключён',
        connecting: 'Подключение',
        ready: 'Соединение установлено'
    };

    /**
     * User's local stream
     */
    let selfStream: MediaStream;

    /**
     * Video element for local stream
     */
    let selfVideo: HTMLVideoElement;

    /**
     * Room data
     */
    let room: Writable<RoomData>;

    /**
     * Room member streams
     */
    let streams: Writable<RoomStreams>;

    /**
     * Connecting state
     */
    let state: Writable<'disconnected' | 'connecting' | 'ready'>;

    /**
     * Switch track enable state
     * @param type
     */
    function switchTrack(type: 'audio' | 'video'): void {
        const changedState = !streamOptions.tracks[type];
        streamOptions.tracks[type] = changedState;
        meet?.changeTrack(type, changedState);
    }

    /**
     * Refresh connection
     */
    async function refreshConnection(): Promise<void> {
        await meet?.endCall();
        await meet?.beginCall();
    }

    let meet: Meeting;
    onMount(async () => {
        meet = new Meeting({
            roomID,
            streamOptions,
            displayName: username
        });

        await meet.setupStream();
        await new Promise(r => setTimeout(r, 1000));

        room = meet.room;
        state = meet.state;
        streams = meet.streams;
        selfStream = meet.stream;

        await new Promise(r => setTimeout(r, 1000));
        meet.beginCall().then();
    });

    onDestroy(() => {
        meet?.endCall();
    });

    $: if ($state === 'ready') {
        selfVideo.srcObject = selfStream;
        selfVideo.addEventListener('loadedmetadata', () => {
            selfVideo.play();
        }, {once: true});
    }
</script>

{#if !streamOptions || !selfStream || !room || !streams || !$streams}
    <div class="sub-page" out:fade={{duration: 150}}>
        <Preloader text="Подготовка" />
    </div>
{:else}
    <div class="sub-page" in:fade={{duration: 150, delay: 150}}>
        <div class="room">
            <div class="header">
                <div class="text">
                    <p><b>{roomID}</b></p>
                    <div class="status">
                        <div class="circle {$state}"></div>
                        <p>{statuses[$state]}</p>
                        {#if $state === 'disconnected'}
                            <a href="#reconnect" on:click={() => refreshConnection()}>
                                <ArrowClockwise size={16} color="white" weight="bold" />
                            </a>
                        {/if}
                    </div>
                </div>
                <div class="actions">
                    <button class="accent" on:click={getInvitationLink}>
                        <span>Пригласить</span>
                        <Link size={16} color="white" weight="bold" />
                    </button>
                    <button class="danger" on:click={() => location.href = '/'}>
                        <span>Выйти</span>
                        <SignOut size={16} color="white" weight="bold" />
                    </button>
                </div>
            </div>
            <div class="videos">
                <VideoGrid {room} {streams} />
            </div>
            <div class="toolbar">
                <div class="stream-controls">
                    <button class="track"
                            on:click={switchTrack.bind(null, 'audio')}
                            disabled={!streamOptions.enabled}
                            class:off={!streamOptions.tracks.audio}>
                        <Microphone size={24} color="white" weight="bold" />
                    </button>
                    <button class="track"
                            on:click={switchTrack.bind(null, 'video')}
                            disabled={!streamOptions.enabled}
                            class:off={!streamOptions.tracks.video}>
                        <Webcam size={24} color="white" weight="bold" />
                    </button>
                    <button disabled class="track">
                        <Screencast size={24} color="white" weight="bold" />
                    </button>
                </div>
                <button class="chat">
                    <ChatCircle size={24} color="white" weight="bold" />
                </button>
            </div>

            <div class="self-video">
                <video bind:this={selfVideo} muted></video>
                {#if $state !== 'ready'}
                    <div class="preloader" transition:fade={{duration: 150}}>
                        <div class="circle-box">
                            <div class="circle"></div>
                        </div>
                    </div>
                {/if}
                {#if !streamOptions.tracks.audio && $state === 'ready'}
                    <div class="microphone-off" transition:fade={{duration: 150}}>
                        <MicrophoneSlash size={24} color="black" weight="bold"/>
                        <span>Микрофон выключен</span>
                    </div>
                {/if}
                {#if !streamOptions.tracks.video && $state === 'ready'}
                    <div class="webcam-off" transition:fade={{duration: 150}}>
                        <div class="circle">
                            <WebcamSlash size={40} color="white" />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .sub-page {
      width: 100%;
      height: 100%;
    }

    .room {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      align-items: stretch;

      .self-video {
        position: fixed;
        z-index: 10;
        left: 16px;
        bottom: 90px;
        width: 500px;
        border: 1px solid var(--panel);
        border-radius: var(--round-l);
        overflow: hidden;

        .microphone-off {
          position: absolute;
          z-index: 8;
          left: 16px;
          bottom: 16px;
          padding: 8px;
          background: white;
          border-radius: 32px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;

          span {
            margin-left: 8px;
            font: 500 14px Inter, Roboto, sans-serif;
            color: black;
          }
        }

        .webcam-off {
          position: absolute;
          z-index: 7;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .circle {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--error);
          }
        }

        .preloader {
          position: absolute;
          z-index: 9;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .circle-box {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;

            .circle {
              width: 24px;
              height: 24px;
              border-radius: 24px;
              border: 2px solid white;
              border-bottom-color: rgba(white, .25);
              animation: spin .5s linear infinite;
            }
          }
        }

        video {
          width: 100%;
          background: black;
          transform: scaleX(-1);
        }
      }

      .header {
        width: 100%;
        height: 75px;
        padding: 0 16px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--panel);

        .text {
          display: flex;
          flex-flow: column;
          align-items: flex-start;

          .status {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            margin-top: 4px;

            .circle {
              width: 12px;
              height: 12px;
              border-radius: 8px;
              background: white;
              margin-right: 8px;

              &.disconnected {
                background: var(--error);
              }

              &.connecting {
                background: #ff8000;
              }

              &.ready {
                background: var(--success);
              }
            }

            a {
              display: block;
              width: 24px;
              height: 24px;
              margin-left: 8px;
              padding: 4px;
              background: var(--panel);
              border-radius: var(--round-s);
              transition: transform .2s cubic-bezier(.25, 0, 0, 1),
                          background .2s cubic-bezier(.25, 0, 0, 1);

              &:hover {
                transform: scale(1.2);
                background: rgba(white, .5);
              }

              &:active {
                transform: scale(.8);
              }
            }
          }
        }

        .actions {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;

          button {
            height: 32px;

            &:first-child {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }

            &:last-child {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
      }

      .videos {
        width: 100%;
        flex: 1;
      }

      .toolbar {
        width: 100%;
        height: 75px;
        padding: 0 16px;
        border-top: 1px solid var(--panel);
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;

        .stream-controls {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;

          button.track {
            width: 48px;
            height: 48px;
            padding: 0;
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
        }

        button.chat {
          width: 48px;
          height: 48px;
          padding: 0;
          background: var(--panel);
          border: 1px solid rgba(white, .5);
        }
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
</style>