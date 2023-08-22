<script lang="ts">
    import CoverImg from '../assets/cover.png';

    let name: string = localStorage.getItem('username') ?? '';
    let roomID: string = (new URLSearchParams(location.search)).get('room') ?? '';

    function joinRoom() {
        if (!name.trim() || !roomID.trim()) {
            return alert('Заполните все поля');
        }
        location.search = `?room=${roomID}&user=${name}`;
        localStorage.setItem('username', name);
    }

    function generateID() {
        const dict = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const mask = 'xxxx-xxxx-xxxx-xxxx';
        roomID = mask.replaceAll(/x/g, () => dict.charAt(Math.floor(Math.random() * dict.length)));
    }
</script>

<div class="page">
    <form on:submit|preventDefault={joinRoom}>
        <div class="fields">
            <h2>Добро пожаловать в<br/><b>KAMAZ Call</b></h2>

            <div class="field">
                <label for="name">Как Вас зовут?</label>
                <input type="text" minlength="2" maxlength="30" id="name" bind:value={name} required>
            </div>

            <div class="field">
                <label for="room">Идентификатор комнаты</label>
                <div class="field-line">
                    <input type="text" minlength="2" maxlength="30" id="room" bind:value={roomID} required>
                    <button type="button" class="field-button" on:click={generateID}>Сгенерировать</button>
                </div>
            </div>

            <button type="submit">Подключиться</button>
        </div>
        <div class="cover">
            <img src="{CoverImg}" alt="">
        </div>
    </form>
</div>

<style lang="scss">
    form {
      width: 100%;
      max-width: 700px;
      border: 1px solid #dfdfdf;
      border-radius: 16px;
      font-family: Inter, Roboto, sans-serif;
      color: black;
      display: flex;
      flex-flow: row nowrap;
      align-items: stretch;
      box-shadow: 0 8px 32px rgba(0, 0, 0, .15);
      overflow: hidden;

      h2 {
        margin-bottom: 32px;
      }

      .fields {
        flex: 1;
        padding: 16px 24px;
        border-right: 1px solid #dfdfdf;

        .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: stretch;
          margin-bottom: 32px;

          label {
            margin-bottom: 8px;
            font: 500 16px Inter, Roboto, sans-serif;
            color: rgba(black, .5);
          }

          input {
            border-radius: 8px;
            padding: 8px 12px;
            border: 1px solid #cfcfcf;
            transition: all .2s cubic-bezier(.25, 0, 0, 1);

            &:hover {
              border-color: black;
            }
          }

          .field-line {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;

            button.field-button {
              padding: 8px 12px;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }

            input {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          }
        }

        button {
          padding: 12px 16px;
          border-radius: 8px;
          background: #167bff;
          border: none;
          outline: 0;
          color: white;
          cursor: pointer;
          font: 500 14px Inter, Roboto, sans-serif;
          transition: background-color .2s cubic-bezier(.25, 0, 0, 1);

          &:hover {
            background: #1355a9;
          }
        }
      }

      .cover {
        flex: 1;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
</style>
