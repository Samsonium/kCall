<script lang="ts">
    export let text = 'Загрузка данных';
</script>

<div class="preloader">
    <div class="spinner-wrapper">
        <div class="spinner"></div>
    </div>
    <p>{text}</p>
</div>

<style lang="scss">
    .preloader {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;

      .spinner-wrapper {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;

        .spinner {
          width: 24px;
          height: 24px;
          border-radius: 16px;
          border: 4px solid var(--accent);
          border-bottom-color: transparent;
          animation: spin .5s linear infinite;
        }
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
</style>
