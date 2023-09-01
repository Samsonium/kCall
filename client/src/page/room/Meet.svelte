<script lang="ts">
    import {notify} from '../../utils/notifier';
    import getInvitationLink from '../../utils/getInvitationLink';
    import FormGroup from '../../ui/FormGroup.svelte';
    import {ArrowRight} from 'phosphor-svelte';

    /**
     * Room ID
     */
    export let room: string;

    /**
     * Username binding
     */
    export let user: string;

    /**
     * Username binding to input
     */
    let tempName = '';

    /**
     * On username enter
     */
    function handleSubmitForm(): void {
        const preparedName = tempName.trim().split(' ').filter(Boolean).join(' ');

        if (!preparedName) return notify.error({
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

        localStorage.setItem('last-used-name', preparedName);
        user = preparedName;
    }
</script>

<div class="meet">
    <form on:submit|preventDefault={handleSubmitForm}>
        <h1>Давайте знакомиться!</h1>
        <p>
            Подготовка ко входу в комнату
            <a href="#generate-link" on:click={getInvitationLink}>{room}</a>
        </p>
        <FormGroup label="Как Вас зовут?" bind:value={tempName} />
        <button class="accent">
            <span>Далее</span>
            <ArrowRight size={16} color="white" weight="bold" />
        </button>
    </form>
</div>

<style lang="scss">
    .meet {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      padding: 16px;

      form {
        width: 100%;
        max-width: 350px;
        padding: 16px;
        border: 1px solid var(--panel);
        border-radius: var(--round-l);

        p {
          margin-bottom: 24px;

          a {
            color: white;
            white-space: nowrap;
            text-decoration: underline;
          }
        }
      }
    }
</style>
