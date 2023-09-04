<script lang="ts">
    import i18n from '../utils/i18n';
    import trLib from '../translations/lib.json';

    const translate = i18n(trLib);
</script>

<div class="placeholder">
    <p>{translate('page_not_found')}</p>

    <button class="accent" on:click={() => location.href = '/'}>
        {translate('go_home')}
    </button>
</div>

<style lang="scss">
    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;

      p {
        margin-bottom: 16px;
      }
    }
</style>
