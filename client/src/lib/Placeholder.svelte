<div class="placeholder">
    <p>Страница не найдена</p>

    <button class="accent" on:click={() => location.href = '/'}>
        Вернуться на главную
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
