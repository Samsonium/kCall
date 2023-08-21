<script lang="ts">
    import {roomInfo, streamInfo} from '../utils/store';
    import {onMount} from 'svelte';
    import {slide} from 'svelte/transition';
    import {io, Socket} from 'socket.io-client';
    import {type MediaConnection, Peer} from 'peerjs';
    import type SocketOutMethods from '../utils/SocketOutMethods';
    import type SocketInMethods from '../utils/SocketInMethods';

    let peer: Peer;
    let socket: Socket<SocketOutMethods, SocketInMethods>;
    let myVideo: HTMLVideoElement;
    let videoGrid: HTMLDivElement;

    onMount(() => {
        peer = new Peer({
            host: 'localhost',
            path: '/peer',
            port: 7000,
            secure: true
        });

        peer.on('open', id => {
            socket = io(`ws://${location.hostname}:7000`, {
                path: '/socket'
            });
            socket.on('connect', () => {
                socket.on('joinAccepted', (chatHistory) => {
                    $roomInfo.ready = true;
                    $roomInfo.chat = chatHistory;
                    console.log(chatHistory);

                    socket.on('newMessage', (userID, message) => {
                        $roomInfo.chat = [...$roomInfo.chat, {
                            name: userID,
                            message
                        }]
                    });
                });

                navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                }).then((myStream: MediaStream) => {
                    for (const track of myStream.getTracks()) {
                        if (track.kind === 'audio' && !$streamInfo.audio)
                            track.enabled = false;
                        if (track.kind === 'video' && !$streamInfo.video)
                            track.enabled = false;
                    }

                    myVideo.srcObject = myStream;
                    myVideo.muted = true;
                    myVideo.addEventListener('loadedmetadata', () => {
                        myVideo.play();
                    });

                    // Setup peer call event
                    peer.on('call', (call: MediaConnection) => {
                        call.answer(myStream);
                        const video = document.createElement('video');
                        call.on('stream', (otherStream: MediaStream) => {
                            addVideoStream(video, otherStream);
                        });
                        call.on('close', () => {
                            video.remove();
                        });
                    });

                    socket.on('userJoined', (userID, userName) => handleUserConnection(userID, myStream));
                    socket.on('userLeaved', (userID) => handleUserLeave(userID));

                    socket.emit('joinRoom', $roomInfo.id, id, $roomInfo.user);
                });
            });
            socket.on('connect_error', (err) => {
                console.log('Cannot connect:', err);
                alert('Ошибка подключения!');
                socket.close();
            });
        });
    });

    /** Chat */
    let chat = [];
    $: if ($roomInfo.chat) chat = $roomInfo.chat;

    /** Typing message value */
    let message = ''

    /**
     * Adds new media stream
     * @param container
     * @param stream
     */
    function addVideoStream(container: HTMLVideoElement, stream: MediaStream) {
        container.srcObject = stream;
        container.addEventListener('loadedmetadata', () => container.play());
        videoGrid.append(container);
    }

    /**
     * New user in room event handler
     * @param userID
     * @param stream
     */
    function handleUserConnection(userID: string, stream: MediaStream) {
        const call = peer.call(userID, stream);
        const video = document.createElement('video');
        video.id = userID;
        call.on('stream', (userStream: MediaStream) => {
            addVideoStream(video, userStream);
            $roomInfo.members[userID] = call;
        });
        call.on('close', () => {
            video.remove();
            delete $roomInfo.members[userID];
            $roomInfo.members = $roomInfo.members;
        });
    }

    /**
     * User leave event handler
     */
    function handleUserLeave(userID: string) {
        delete $roomInfo.members[userID];
        $roomInfo.members = $roomInfo.members;
        document.querySelector<HTMLVideoElement>(`[id="${userID}"]`)?.remove();
    }

    /**
     * Leave the room
     */
    function leaveRoom() {
        $roomInfo = null;
        location.search = '';
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
        <h3>KAMAZ Call &horbar; {$roomInfo.id}</h3>
        <button class="exit" on:click={leaveRoom}>Отключиться</button>
    </div>
    <div class="video-box">
        <div class="videos" bind:this={videoGrid}></div>
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
          display: grid;
          grid-template-columns: auto;
          grid-template-rows: auto;

          :global(video) {
            flex: 1;
            aspect-ratio: 16 / 9;
            background: #21272d;
            margin: 8px;
            border-radius: 16px;
            object-fit: cover;
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
