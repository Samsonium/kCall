<script lang="ts">
    import {roomInfo} from '../utils/store';
    import {onMount} from 'svelte';
    import {slide} from 'svelte/transition';
    import {io, Socket} from 'socket.io-client';
    import type SocketOutMethods from '../utils/SocketOutMethods';
    import type SocketInMethods from '../utils/SocketInMethods';

    let socket: Socket<SocketOutMethods, SocketInMethods>;
    let myVideo: HTMLVideoElement;

    onMount(() => {
        socket = io(`ws://${location.hostname}:7000`, {
            path: '/socket'
        });
        socket.on('connect', () => {
            socket.on('joinAccepted', (chatHistory) => {
                $roomInfo.connected = true;
                $roomInfo.chat = chatHistory;
                console.log(chatHistory);

                socket.on('newMessage', (userID, message) => {
                    $roomInfo.chat = [...$roomInfo.chat, {
                        name: userID,
                        message
                    }]
                });

                navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                }).then((myStream: MediaStream) => {
                    myVideo.srcObject = myStream;
                    myVideo.muted = true;
                    myVideo.addEventListener('loadedmetadata', () => {
                        myVideo.play();
                    })
                });
            });
            socket.emit('joinRoom', $roomInfo.id, $roomInfo.user);
        });
        socket.on('connect_error', (err) => {
            console.log('Cannot connect:', err);
            alert('Ошибка подключения!');
            socket.close();
        });
    });

    /** Chat */
    let chat = [];
    $: if ($roomInfo.chat) chat = $roomInfo.chat;

    /** Typing message value */
    let message = ''

    /**
     * Leave the room
     */
    function leaveRoom() {
        $roomInfo = null;
    }

    /**
     * Send message to the room
     */
    function sendMessage() {
        socket.emit('sendMessage', message);
        message = '';
    }
</script>

<div class="room">
    <div class="header">
        <h3>kCall &horbar; {$roomInfo.id}</h3>
        <button class="exit" on:click={leaveRoom}>Отключиться</button>
    </div>
    <div class="video-box">
        <div class="videos">
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
            <video></video>
        </div>
        <div class="self-video">
            <video bind:this={myVideo}></video>
        </div>
    </div>
    <div class="chat-box">
        <div class="history">
            <div class="history-scrollable">
                {#each chat as message, i}
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
            <input type="text" minlength="1" maxlength="256" placeholder="Сообщение" bind:value={message}>
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
      grid-template-columns: 1fr 500px;
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
          padding: 12px 16px;
          background: #ff4040;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font: 500 14px Inter, Roboto, sans-serif;
          transition: background .2s cubic-bezier(.25, 0, 0, 1);

          &:hover {
            background: #b42c2c;
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

        .videos {
          width: 100%;
          height: 100%;
          padding: 32px;
          display: flex;
          flex-flow: row wrap;
          align-items: center;
          justify-content: center;
          align-content: center;

          video {
            width: 30%;
            aspect-ratio: 16 / 9;
            background: #21272d;
            margin: 8px;
            border-radius: 16px;
          }
        }

        .self-video {
          position: absolute;
          z-index: 9;
          bottom: 16px;
          right: 16px;
          width: 400px;
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
</style>
