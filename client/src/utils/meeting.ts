import Peer, {type MediaConnection} from 'peerjs';
import {notify} from './notifier';
import {io, Socket} from 'socket.io-client';
import {get, writable, type Writable} from 'svelte/store';
import type {
    RoomData,
    RoomMember,
    RoomMessage,
    SocketClientEvents,
    SocketServerEvents
} from 'tools/types/types';
import type MeetingConfig from '../types/MeetingConfig';
import type StreamOptions from '../types/StreamOptions';
import type RoomStreams from '../types/RoomStreams';

/**
 * Class for meeting call
 */
export default class Meeting {
    private readonly _roomID: string;

    // -------- [ User data ]

    private readonly _displayName: string;
    private readonly _streamOptions: Writable<StreamOptions>;
    private _userID?: string;

    // -------- [ Connection data ]

    private readonly _streams: Writable<RoomStreams>;
    public readonly state: Writable<'disconnected' | 'connecting' | 'ready'>;
    public readonly room: Writable<RoomData>;
    private _stream?: MediaStream;
    private socket?: Socket<SocketServerEvents, SocketClientEvents>;
    private peer?: Peer;

    // -------- [ Base methods ]

    public constructor(setup: MeetingConfig) {
        const {
            roomID,
            displayName,
            streamOptions
        } = setup;

        this._roomID = roomID;
        this._displayName = displayName;
        this._streamOptions = writable(streamOptions);
        this._streams = writable({});
        this.state = writable('connecting');
        this.room = writable();
    }

    /**
     * Get stream by `streamOptions.enabled` state
     */
    public setupStream(): Promise<void> {
        return new Promise<void>(done => {
            const options = get(this._streamOptions);
            if (options.enabled) {
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        aspectRatio: matchMedia('only screen and (max-width: 750px)').matches
                            ? 4 / 3 : 16 / 9,
                        facingMode: 'user',
                        frameRate: 24,
                        width: {
                            max: 500
                        }
                    }
                }).then((stream) => {
                    this._stream = stream;

                    const video = this._stream.getVideoTracks()[0];
                    video.enabled = options.tracks.video;

                    const audio = this._stream.getAudioTracks()[0];
                    audio.enabled = options.tracks.audio;

                    done();
                });
            } else {
                this._stream = this.createEmptyStream();
                done();
            }
        });
    }

    /**
     * Create empty track if no media devices available
     */
    private createEmptyStream(): MediaStream {

        // Audio
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const destination = context.createMediaStreamDestination();
        oscillator.connect(destination);
        oscillator.start();
        const audioTrack = destination.stream.getAudioTracks()[0];
        audioTrack.enabled = false;

        // Video
        const canvas = document.createElement('canvas');
        const aspect = matchMedia('only screen and (max-width: 750px)').matches
            ? 4 / 3 : 16 / 9;
        canvas.height = (canvas.width = 500) / aspect;
        canvas.getContext('2d')!.fillRect(0, 0, canvas.width, canvas.height);
        const videoStream = canvas.captureStream(1);
        const videoTrack = videoStream.getVideoTracks()[0];
        videoTrack.enabled = false;

        // Combine
        return new MediaStream([audioTrack, videoTrack]);
    }

    /**
     * Join meeting room
     */
    public async beginCall() {
        try {
            await this.setupPeer();
            await this.setupSocket();
        } catch (e) {
            console.error(e);
            notify.error({
                title: 'Ошибка подключения',
                message: 'Невозможно установить соединение'
            });
            await this.endCall();
            return;
        }
    }

    /**
     * End call and stop all connections
     */
    public async endCall() {
        this.socket!.emit('leaveRoom');
        this?.peer?.destroy();
        this?.socket?.disconnect();
        this.state.set('disconnected');
    }

    // -------- [ Peer connection ]

    /**
     * Setup peer connection
     */
    private setupPeer(): Promise<void> {
        return new Promise<void>((done, error) => {
            this.peer = new Peer({
                debug: 2,
                host: 'peer.k-call.ru',
                secure: true,
                config: {
                    iceServers: [
                        {urls: 'stun:stun.arbuz.ru:3478'},
                        {urls: 'stun:stun.chathelp.ru:3478'},
                        {urls: 'stun:stun.comtube.ru:3478'},
                        {urls: 'stun:stun.demos.ru:3478'},
                        {urls: 'stun:stun.kanet.ru:3478'},
                        {urls: 'stun:stun.mgn.ru:3478'},
                        {urls: 'stun:stun.ooonet.ru:3478'},
                        {urls: 'stun:stun.sipnet.ru:3478'},
                        {urls: 'stun:stun.skylink.ru:3478'},
                        {urls: 'stun:stun.tis-dialog.ru:3478'},
                        {urls: 'stun:stun.l.google.com:19302'},
                    ],
                    bundlePolicy: 'max-bundle'
                } satisfies RTCConfiguration
            });

            // Open connection event
            this.peer.on('open', id => {
                this._userID = id;
                done();
            });

            // Connection error event
            this.peer.on('error', (err) => error(err));

            // Incoming call
            this.peer.on('call', (call) => {
                this.peerHandler().answer(call);
            });
        });
    }

    /**
     * Make peer connection handler
     * @param meta Metadata
     */
    private peerHandler(meta?: { userID: string }) {
        const callback = (call: MediaConnection) => {
            const userID = meta?.userID ?? call.metadata.userID;
            call.on('stream', (gottenStream) => {
                this._streams.update(streams => {
                    streams[userID] = gottenStream;
                    return streams;
                });
            });
        };

        return {
            call: () => {
                if (!meta?.userID || !this._stream || !this.peer) return;
                const call = this.peer.call(meta.userID, this._stream, {
                    metadata: {
                        userID: this._userID
                    }
                });
                callback(call);
            },
            answer: (call: MediaConnection) => {
                call.answer(this._stream);
                callback(call);
            }
        }
    }

    // -------- [ Socket connection ]

    /**
     * Setup socket.io connection
     */
    private setupSocket(): Promise<void> {
        return new Promise<void>((done, error) => {
            this.socket = io('https://api.k-call.ru/');

            // Connection established event
            this.socket.on('connect', () => {
                this.setupSocketEvents();
                this.socket!.emit('joinRoom', this._roomID, {
                    uid: this._userID!,
                    name: this._displayName,
                    streamOptions: get(this._streamOptions).tracks
                });
                done();
            });

            // Connection error event
            this.socket.on('connect_error', (err) => error(err));
        });
    }

    /**
     * Setup socket.io event handlers
     */
    private setupSocketEvents(): void {

        // On room join request approved
        this.socket!.on('joinAccept', (room: RoomData) => {
            this.room.set(room);
            this.state.set('ready');
        });

        // On room data update
        this.socket!.on('roomUpdated', (room: RoomData) => {
            this.room.set(room);
        });

        // On user room join
        this.socket!.on('userJoined', (user: RoomMember) => {
            this.peerHandler({userID: user.uid}).call();
            this.room.update((room) => {
                room.members.push(user);
                return room;
            });
            notify.success({
                message: user.name + ' присоединился'
            });
        });

        // On new message
        this.socket!.on('newMessage', (message: RoomMessage) => {
            this.room.update((room) => {
                room.chat.push(message);
                return room;
            });
        });

        // On user leave room
        this.socket!.on('userLeave', (user: RoomMember) => {
            this._streams.update((streams) => {
                delete streams[user.uid];
                return streams;
            });
            notify.error({
                message: user.name + ' отключился'
            });
        });

        // On disconnect
        this.socket!.on('disconnect', () => {
            this.endCall().then();
        });
    }

    /**
     * Send message to room
     * @param text Text of the message
     */
    public sendMessage(text: string): void {
        this.socket!.emit('sendMessage', text);
    }

    /**
     * Change stream tracks enable state
     * @param type Track type
     * @param state Current state
     */
    public changeTrack(type: 'audio' | 'video', state: boolean): void {
        let track: MediaStreamTrack;
        switch (type) {
            case 'audio':
                track = this._stream!.getAudioTracks()[0];
                break;
            case 'video':
                track = this._stream!.getVideoTracks()[0];
                break;
        }

        track.enabled = state;
        this.socket!.emit('changeStream', type, state);
    }

    // -------- [ Getters ]

    public get stream(): MediaStream {
        return this._stream!;
    }

    public get streams(): Writable<RoomStreams> {
        return this._streams;
    }

    public get userID(): string {
        return this._userID!;
    }

    public get displayName(): string {
        return this._displayName;
    }

    public get streamOptions(): Writable<StreamOptions> {
        return this._streamOptions;
    }
}
