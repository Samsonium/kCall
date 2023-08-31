<script lang="ts">
    export let label = 'Title';
    export let value = '';

    const id = 'fg-xxxxxx'.replaceAll(/x/g, () => Math.floor(Math.random() * 9).toString());
</script>

<div class="form-group">
    <label for={id}>{label}</label>
    <div class="input-line">
        <input {id} class:no-r-round={$$slots.default} type="text" bind:value>
        <slot/>
    </div>
</div>

<style lang="scss">
    .form-group {
      width: 100%;
      display: flex;
      flex-flow: column;
      align-items: stretch;
      padding-bottom: 16px;

      label {
        font: 500 14px Inter, Roboto, sans-serif;
        color: white;
        padding: 0;
        margin: 0 0 8px;
      }

      .input-line {
        height: 38px;
        display: flex;
        flex-flow: row nowrap;
        align-items: stretch;

        input {
          flex: 1;
          border-radius: var(--round-s);
          background: var(--panel);
          border: 1px solid transparent;
        }
      }
    }
</style>
