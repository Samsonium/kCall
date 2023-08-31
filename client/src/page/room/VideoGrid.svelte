<script lang="ts">
    import Video from './Video.svelte';
    import type {RoomData} from 'tools/types/types';
    import type {Writable} from 'svelte/store';
    import type RoomStreams from '../../types/RoomStreams';
    import type StreamOptions from '../../types/StreamOptions';

    export let room: Writable<RoomData>;
    export let streams: Writable<RoomStreams>;

    let videos: {
        name: string,
        stream: MediaStream,
        streamOptions: StreamOptions['tracks']
    }[] = [];

    $: {
        videos = [];
        console.log($streams);
        console.log($room);
        for (const userID in $streams) {
            const member = $room.members.find((user) => user.uid === userID);
            if (!member) continue;
            videos.push({
                name: member.name,
                stream: $streams[userID],
                streamOptions: member.streamOptions
            });
        }
    }
</script>

<div class="video-grid">
    {#each videos as video}
        <div class="video-box">
            <Video {...video} />
        </div>
    {/each}
</div>

<style lang="scss">
    .video-grid {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: center;
      padding: 32px;

      .video-box {
        min-width: calc(300px / 3 * 4);
        height: 300px;
        margin: 16px;
      }
    }
</style>
