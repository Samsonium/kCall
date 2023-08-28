<script lang="ts">
    import VideoBox from './VideoBox.svelte';
    import type MemberStreams from '../../utils/MemberStreams';
    import type RoomData from '../../../../types/RoomData';
    import type {Writable} from 'svelte/store';
    import {onMount} from 'svelte';

    export let memberStreams: Writable<MemberStreams>;
    export let roomData: Writable<RoomData>;

    let streams: {
        stream: MediaStream;
        name: string;
    }[] = [];

    $: if ($roomData?.members?.length) {
        console.log(roomData);
        if ($memberStreams) {
            streams = [];
            for (const userID in $memberStreams) {
                const member = $roomData.members.find((member) => member.userID === userID);
                streams.push({
                    stream: $memberStreams[userID].stream,
                    name: member?.displayName ?? 'Неизвестный'
                });
            }
        }
    }

    onMount(() => {
        roomData?.subscribe((data) => {
            streams = [];
            for (const member of data.members) {
                const userID = member.userID;
                streams.push({
                    stream: $memberStreams[userID].stream,
                    name: member.displayName
                });
            }
        })
    })
</script>

{#if $memberStreams && $roomData}
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
