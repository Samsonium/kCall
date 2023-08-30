<script lang="ts">
    export let params: Record<string, string> = {};

    console.log(params);
</script>

<p>Room</p>
<ul>
    {#each Object.entries(params) as param}
        <li>{param[0]} = {param[1]}</li>
    {/each}
</ul>
