<script lang="ts">
    import {roomInfo, streamInfo} from '../utils/store';
    import {onMount} from 'svelte';
    import {slide} from 'svelte/transition';
    import {io, Socket} from 'socket.io-client';
    import {type MediaConnection, Peer} from 'peerjs';
    import type SocketOutMethods from '../utils/SocketOutMethods';
    import type SocketInMethods from '../utils/SocketInMethods';
    import VideoBox from './Room/VideoBox.svelte';
    import {SignOut} from 'phosphor-svelte';

    let peer: Peer;
    let socket: Socket<SocketOutMethods, SocketInMethods>;
    let myVideo: HTMLVideoElement;
    let videoGrid: HTMLDivElement;

    onMount(() => {
        peer = new Peer();

        peer.on('open', id => {
            const connectionPath = import.meta.env.DEV
                ? `${location.hostname}:7000`
                : `${location.host}`;

            socket = io(connectionPath, {
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

                navigator?.mediaDevices?.getUserMedia({
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
                        const userID = call.connectionId;
                        call.answer(myStream);
                        call.on('stream', (otherStream: MediaStream) => {
                            socket.emit('whoIsIt', userID, (result: { id: string, name: string }) => {
                                if (result.id === userID) {
                                    handleUserConnection(userID, otherStream, result.name);
                                }
                            });
                        });
                    });

                    socket.on('userJoined', (userID, displayName) => handleUserConnection(userID, myStream, displayName));
                    socket.on('userLeaved', (userID) => handleUserLeave(userID));
                }).catch((err) => console.error(err));

                socket.on('userJoined', (userID, displayName) => handleUserConnection(userID, new MediaStream(), displayName));
                socket.emit('joinRoom', $roomInfo.id, id, $roomInfo.user);
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
     * @param video
     * @param stream
     */
    function addVideoStream(container: HTMLDivElement, video: HTMLVideoElement, stream: MediaStream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => video.play());
        videoGrid.append(container);
    }

    /**
     * New user in room event handler
     * @param userID
     * @param stream
     * @param name Display name of the user
     */
    function handleUserConnection(userID: string, stream: MediaStream, name: string) {
        const call = peer.call(userID, stream);
        const box = document.createElement('div');
        box.style.display = 'contents';

        const video = document.createElement('video');
        const component = new VideoBox({
            target: box,
            props: {
                name,
                video
            }
        });

        call.on('stream', (userStream: MediaStream) => {
            addVideoStream(box, video, userStream);
            $roomInfo.members[userID] = call;
        });
        socket.on('userLeaved', (leavedUserID) => {
            if (userID === leavedUserID) {
                if (video || component) {
                    video?.remove();
                    component?.$destroy();
                    delete $roomInfo.members[userID];
                }
            }
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
        <h3>
            kCall
            &horbar;
            {$roomInfo.id}
        </h3>
        <button class="exit" on:click={leaveRoom}>
            <SignOut size={24} color="white" weight="bold" />
            <span class="on-pc">Отключиться</span>
        </button>
    </div>
    <div class="video-box">
        <div class="video-grid">
            <div class="videos" bind:this={videoGrid}></div>
        </div>
        <div class="self-video">
            <video bind:this={myVideo} muted></video>
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
          padding: 12px 16px;
          background: #ff4040;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font: 500 14px Inter, Roboto, sans-serif;
          transition: background .2s cubic-bezier(.25, 0, 0, 1);

          span.on-pc {
            display: inline-block;
          }

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

        .video-grid {
          width: 100%;
          height: 100%;
          overflow: hidden;

          .videos {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: row wrap;
          }
        }

        .self-video {
          position: absolute;
          z-index: 9;
          bottom: 16px;
          right: 16px;
          width: 400px;
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

      .video-box {
        grid-column-start: 1 !important;
        grid-column-end: col2-end !important;

        .videos {
          height: calc(100% - ((100vw - 32px) / 16 * 9));
        }
      }
    }
</style>
