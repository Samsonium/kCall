import Notification from './Notification';
import {get, writable} from 'svelte/store';
import {roomInfo, streamInfo, room} from './store';
import {Peer, type MediaConnection} from 'peerjs';
import {io, type Socket} from 'socket.io-client';
import type {Writable} from 'svelte/store';
import type RoomData from '../../../types/RoomData';
import type MemberStreams from './MemberStreams';
import type SocketInMethods from '../../../types/SocketInMethods';
import type SocketOutMethods from '../../../types/SocketOutMethods';

/**
 * Extended MediaConnection type with typed metadata
 */
type MediaConnectionWithMeta = MediaConnection & {
    metadata: {
        /**
         * User id at socket
         */
        uid: string;

        /**
         * Display name
         */
        name: string;
    }
}

/**
 * Room call data
 */
export default class RoomCall {
    private readonly socketPort: number;
    private readonly roomID: string;
    private myID: string;

    // -------- [ Room data ]

    public readonly membersStreams: Writable<MemberStreams>;
    private socket: Socket<SocketOutMethods, SocketInMethods>;
    private peer: Peer;

    // -------- [ Self stream ]

    public readonly selfStream: Writable<MediaStream>;
    private readonly selfStreamData: Writable<RoomData['members'][number]['stream']>;

    public constructor() {
        this.socketPort = import.meta.env.DEV ? 7000 : parseInt(location.port);
        if (isNaN(this.socketPort))
            this.socketPort = 443;

        // Set initial stream tracks info
        const streamData = get(streamInfo)
        this.selfStreamData = writable({
            isAudioEnabled: streamData.audio,
            isVideoEnabled: streamData.video
        });

        // Set room id
        this.roomID = get(roomInfo).id;

        // Create member streams store
        this.membersStreams = writable({});

        // Create self stream store
        this.selfStream = writable(null);
    }

    /**
     * Begin room call
     */
    public async startCall() {
        await this.createPeer();
        this.createSocket();

        // Get display name and connect
        const {user} = get(roomInfo);
        this.socket.emit('joinRoom', this.roomID, {
            stream: get(this.selfStreamData),
            displayName: user,
            userID: this.myID,
            peerID: this.myID
        });
    }

    /**
     * End call
     */
    public endCall() {
        this.socket.disconnect();
        this.peer.destroy();
        room.set(null);
        this.membersStreams.set(null);
    }

    // ---------------- [ Peer ]

    /**
     * Setup PeerJS
     */
    public createPeer(): Promise<void> {
        return new Promise<void>(resolve => {
            const peerConfig: Peer['options'] = import.meta.env.DEV ? {
                debug: 3,
                port: this.socketPort,
                path: '/peer',
                host: '/'
            } : {
                debug: 3,
                path: '/peer',
                host: '/',
                secure: true,
                pingInterval: 6000
            };

            this.peer = new Peer(undefined, peerConfig);

            // On peer connection open
            this.peer.on('open', async (id) => {
                this.myID = id;

                let selfStream: MediaStream;
                try {
                    selfStream = await this.getUserStream();
                } catch (e) {
                    console.error('Cannot get user stream:', e.message);
                    selfStream = this.createEmptyStream();
                }
                this.selfStream.set(selfStream);
                this.setupPeerEvents();

                resolve();
            });
        });
    }

    /**
     * New user connection handler
     * @param meta User's metadata
     */
    private handleConnection(meta?: RoomData['members'][number]) {
        const callback = (call: MediaConnectionWithMeta) => {
            const userID = meta?.userID ?? call.metadata.uid;
            call.on('stream', (stream: MediaStream) => {
                this.membersStreams.update((_memberStreams) => {
                    _memberStreams[userID] = {
                        peerID: userID,
                        stream
                    };
                    return _memberStreams;
                });
            });
        }

        return {
            call: () => {
                const call: MediaConnectionWithMeta = this.peer.call(
                    meta.peerID, get(this.selfStream), {
                    metadata: {
                        uid: this.myID,
                        name: get(roomInfo).user
                    }
                });
                callback(call);
            },
            answer: (call: MediaConnectionWithMeta) => {
                call.answer(get(this.selfStream));
                callback(call);
            }
        };
    }

    /**
     * Setup events on peer connection
     */
    private setupPeerEvents(): void {
        this.peer.on('call', (call: MediaConnectionWithMeta) => {
            this.handleConnection().answer(call);
        });
    }

    /**
     * Request user stream
     */
    private async getUserStream(): Promise<MediaStream> {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
                frameRate: 24,
                aspectRatio: 4 / 3,
                width: {
                    max: 1280
                }
            }
        });

        // Setup initial stream tracks values
        const {isVideoEnabled, isAudioEnabled} = get(this.selfStreamData);
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        videoTrack.enabled = isVideoEnabled;
        audioTrack.enabled = isAudioEnabled;

        return stream;
    }

    /**
     * Create empty media stream
     */
    private createEmptyStream(): MediaStream {

        // Create audio context
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const destination = context.createMediaStreamDestination();
        oscillator.connect(destination);
        oscillator.start();

        // Create audio track
        const audioTrack = destination.stream.getAudioTracks()[0];
        audioTrack.enabled = false;

        // Create canvas for video
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = canvas.width / 4 * 3;
        canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);

        // Create video track
        const videoStream = canvas.captureStream(8);
        const videoTrack = videoStream.getVideoTracks()[0];
        videoTrack.enabled = false;

        // Create and return stream
        return new MediaStream([audioTrack, videoTrack]);
    }

    // ---------------- [ Socket ]

    /**
     * Setup Socket.IO
     */
    public createSocket(): void {
        const connectionPath = import.meta.env.DEV
            ? 'http://localhost:7000/'
            : `https://${location.host}`;
        this.socket = io(connectionPath, {
            path: '/socket'
        });

        // On connection established
        this.socket.on('connect', () => {
            Notification.send(Notification.Type.Success, 'Соединение установлено');
            this.setupSocketEvents();
        });

        // On connection error
        this.socket.on('connect_error', () => {
            Notification.send(Notification.Type.Error, 'Ошибка подключения');
        });
    }

    /**
     * Send message to chat
     * @param message
     */
    public sendMessage(message: string): void {
        this.socket.emit('sendMessage', message);
    }

    /**
     * Change track enable status
     * @param type Track type
     * @param value Current value
     */
    public changeTrack(type: 'audio' | 'video', value: boolean): void {
        if (!get(this.selfStream)) return;

        let track: MediaStreamTrack;
        switch (type) {
            case 'video':
                track = get(this.selfStream).getVideoTracks()[0];
                track.enabled = value;
                break;
            case 'audio':
                track = get(this.selfStream).getAudioTracks()[0];
                track.enabled = value;
                break;
        }

        this.socket.emit('changeStreamParams', type, value);
    }

    /**
     * Setup socket events
     */
    private setupSocketEvents(): void {

        // On room join approved
        this.socket.on('joinAccepted', (roomData) => {
            room.set(roomData);
        });

        // On new typingMessage in room
        this.socket.on('newMessage', (name, message) => {
            roomInfo.update(_roomInfo => {
                _roomInfo.chat.push({ name, message });
                return _roomInfo;
            });
        });

        // On room data update
        this.socket.on('roomDataUpdate', (roomData) => {
            console.log('roomDataUpdate:', roomData);
            room.set(roomData);
        });

        // On new user connected
        this.socket.on('userJoined', (meta) => {
            this.handleConnection(meta).call();
            Notification.send(
                Notification.Type.Success,
                '',
                `${meta.displayName} присоединился`
            );
        });

        // On new user leaved
        this.socket.on('userLeaved', (userID) => {
            this.membersStreams.update(_members => {
                delete _members[userID];
                return _members;
            });

            const members = get(room).members;
            const user = members.find((user) => user.userID === userID);

            Notification.send(
                Notification.Type.Success,
                '',
                `${user.displayName} отключился`
            );
        });
    }
}
