<script lang="ts">
    import {onMount} from 'svelte';
    import {notify} from '../utils/notifier';
    import FormGroup from '../ui/FormGroup.svelte';
    import {ArrowRight} from 'phosphor-svelte';
    import imgPoster from '../assets/poster.png';

    /**
     * URL search parameters
     */
    export let queryParams: Record<string, string>;

    /**
     * User form data
     */
    const formData = {
        name: '',
        room: ''
    };

    function generateRoomId(): void {
        formData.room = 'kcall-xxxx-xxxx'.replaceAll(/x/g, () => Math.floor(Math.random() * 9).toString())
    }

    function handleSubmitForm(): void {
        const preparedName = formData.name.trim().split(' ').filter(Boolean).join(' ');

        if (!preparedName.trim()) return notify.error({
            message: 'Введите имя'
        });

        // Check name length
        if (preparedName.length < 2 || preparedName.length > 30) return notify.error({
            message: 'Длина имени — от 2 до 30 символов'
        });

        // Check name format
        if (!(/^[A-zА-я0-9 ]{2,30}$/.test(preparedName))) return notify.error({
            message: 'Имя должно состоять из букв или цифр'
        });

        // Check room id
        if (!formData.room.trim()) return notify.error({
            message: 'Введите идентификатор комнаты'
        });

        // Check room length
        if (formData.room.length < 2 || formData.room.length > 15) return notify.error({
            message: 'Длина идентификатора команты — от 2 до 15 символов'
        });

        // Check room format
        if (/[!@#$%^&*()\[\] ]/.test(formData.room)) return notify.error({
            message: 'Идентификатор комнаты не должен содержать пробелов и спец. симолов'
        });

        localStorage.setItem('last-used-name', preparedName);
        location.href = `/room/${formData.room}`;
    }

    onMount(() => {
        formData.name = queryParams.name
            ?? localStorage.getItem('last-used-name')
            ?? '';
    })
</script>

<div class="home-page">
    <form on:submit|preventDefault={handleSubmitForm}>
        <div class="text">
            <h1>Добро пожаловать в kCall!</h1>
            <FormGroup label="Как Вас зовут?" bind:value={formData.name} />
            <FormGroup label="Идентификатор комнаты" bind:value={formData.room}>
                <button type="button" class="secondary" on:click={generateRoomId}>Сгенерировать</button>
            </FormGroup>
            <button type="submit" class="accent">
                <span>Присоединиться</span>
                <ArrowRight size={16} color="white" weight="bold" />
            </button>
        </div>
        <div class="cover">
            <img src={imgPoster} alt="poster">
        </div>
    </form>
</div>

<style lang="scss">
    .home-page {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;

      form {
        width: 100%;
        max-width: 700px;
        border: 1px solid var(--panel);
        border-radius: var(--round-l);
        display: flex;
        flex-flow: row nowrap;
        align-items: stretch;
        overflow: hidden;

        .text {
          max-width: 400px;
          flex: 2;
          padding: 16px;
          display: flex;
          flex-flow: column;
          align-items: flex-start;

          & > *:last-child {
            margin-top: 8px;
          }
        }

        .cover {
          flex: 1;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        }
      }
    }

    @media only screen and (max-width: 750px) {
      .home-page {
        padding: 0;
        align-items: flex-start;
        justify-content: flex-start;
      }

      form {
        flex-flow: column-reverse !important;
        border: none !important;
        border-radius: 0 !important;

        .cover {
          height: 200px !important;
          overflow: hidden !important;

          img {
            height: 200px !important;
          }
        }
      }
    }
</style>
