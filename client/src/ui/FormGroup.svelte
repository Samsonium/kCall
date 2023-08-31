<script lang="ts">
    export let label = 'Title';
    export let value = '';

    const id = 'fg-xxxxxx'.replaceAll(/x/g, () => Math.floor(Math.random() * 9).toString());
</script>

<div class="form-group">
    <label for={id}>{label}</label>
    <div class="input-line" class:stacked={$$slots.default}>
        <input {id} type="text" bind:value>
        <slot/>
    </div>
</div>

<style lang="scss">
    .form-group {
      width: 100%;
      min-width: 50px;
      display: flex;
      flex-flow: column;
      align-items: stretch;
      padding-bottom: 24px;

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
          min-width: 50px;
          flex: 1;
          border-radius: var(--round-s);
          background: var(--panel);
          border: 1px solid transparent;
          color: var(--white);
          padding: 4px 12px;
          outline: none;
          font: 400 16px Inter, Roboto, sans-serif;
          transition: border .2s cubic-bezier(.25, 0, 0, 1);

          &:hover {
            border-color: var(--white);
          }

          &:focus {
            border-color: var(--accent);
          }
        }

        &.stacked {
          height: 38px;
          padding: 4px;
          border-radius: var(--round-s);
          background: var(--panel);
          border: 1px solid transparent;
          transition: border .2s cubic-bezier(.25, 0, 0, 1);

          &:hover {
            border-color: var(--white);
          }

          &:focus-within {
            border-color: var(--accent);
          }

          input {
            background: transparent;
            border: none;
          }

          :global(& > *:not(input)) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
    }
</style>
