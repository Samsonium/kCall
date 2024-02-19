<script lang="ts">
    import {onMount} from 'svelte';
    import IMask from 'imask';

    /** Should be full-width */
    export let block = false;

    /** Field id */
    export let id: string;

    /** Input type */
    export let type = 'text';

    /** Field name */
    export let name: string;

    /** Placeholder */
    export let placeholder: string;

    /** Input field mask */
    export let mask: RegExp | string;

    /** Input value */
    export let value = '';

    /** Unmasked value */
    export let unmaskedValue = '';

    /** Input element binding */
    let inputElement: HTMLInputElement;

    /**
     * Input field change event handler
     * @param e Input event
     */
    function handleInput(): void {}

    // Enable iMask if `mask` prop specified
    onMount(() => {
    	if (!mask) return;
    	const imask = IMask(inputElement, {mask});
    	imask.on('accept', () => {
    		value = imask.value;
    		unmaskedValue = imask.unmaskedValue;
    		console.log('Handling input');
    	});

    	return () => imask.destroy();
    });
</script>

<label class="k-input">
    {#if $$slots.prefix}
        <div class="prefix">
            <slot name="prefix"/>
        </div>
    {/if}
    <input {id}
           {type}
           {name}
           {placeholder}
           {value}
           class:block
           on:input={handleInput}
           bind:this={inputElement}>
    {#if $$slots.suffix}
        <div class="suffix">
            <slot name="suffix"/>
        </div>
    {/if}
</label>

<style lang="scss">
    @use 'sass:map';

    .k-input {
      width: 300px;
      height: 41px;
      display: flex;
      flex-flow: row nowrap;
      align-items: stretch;
      border-radius: 8px;
      outline: 1px solid transparent;
      padding: 8px 12px;
      cursor: text;
      background: map.get($t_light, 'border');
      transition: background .2s cubic-bezier(.25, 0, 0, 1),
                  outline-color .2s cubic-bezier(.25, 0, 0, 1);

      // Full-width block
      &.block {
        width: 100%;
      }

      &:hover {
        background: lighten(map.get($t_light, 'border'), 4);
        outline-color: map.get($t_light, 'border');
      }

      &:has(input:focus) {
        background: map.get($t_light, 'background');
        outline-color: map.get($t_light, 'accent');
      }

      // <input>
      input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        font: 400 14px 'Noto Sans Display';
        color: map.get($t_light, 'foreground');
      }

      // Prefix block
      .prefix {
        max-width: max-content;
        max-height: max-content;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      // Suffix block
      .suffix {
        max-width: max-content;
        max-height: max-content;
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
</style>
