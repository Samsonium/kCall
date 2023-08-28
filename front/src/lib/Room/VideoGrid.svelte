<script lang="ts">
    import {room} from '../../utils/store';
    import VideoBox from './VideoBox.svelte';
    import type MemberStreams from '../../utils/MemberStreams';
    import type {Writable} from 'svelte/store';

    export let memberStreams: Writable<MemberStreams>;

    let streams: {
        stream: MediaStream;
        streamSettings: {
            isAudioEnabled: boolean;
            isVideoEnabled: boolean;
        };
        name: string;
    }[] = [];

    $: if ($room?.members?.length) {
        console.log($room);
        if ($memberStreams) {
            streams = [];
            for (const userID in $memberStreams) {
                const member = $room.members.find((member) => member.userID === userID);
                streams.push({
                    stream: $memberStreams[userID].stream,
                    name: member?.displayName ?? 'Неизвестный',
                    streamSettings: member?.stream ?? {
                        isAudioEnabled: false,
                        isVideoEnabled: false
                    }
                });
            }
        }
    }
</script>

{#if $memberStreams && $room}
    <div class="video-grid">
        <div class="videos">
            {#each streams as data}
                <VideoBox {...data} />
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
  .video-grid {
    width: 100%;
    height: calc(100vh - 64px);
    overflow-y: auto;
    overflow-x: hidden;

    .videos {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      align-content: flex-start;
      justify-content: center;
    }
  }
</style>
