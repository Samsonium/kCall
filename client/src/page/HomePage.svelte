<script lang="ts">
    import {onMount} from 'svelte';
    import {slide} from 'svelte/transition';
    import i18n from '../utils/i18n';
    import language from '../utils/language';
    import {notify} from '../utils/notifier';
    import FormGroup from '../ui/FormGroup.svelte';
    import {ArrowRight} from 'phosphor-svelte';
    import imgPoster from '../assets/poster.png';
    import imgFlagRu from '../assets/flag_ru.svg';
    import imgFlagEn from '../assets/flag_en.svg';
    import trFormValidation from '../translations/form-validation.json';
    import trHome from '../translations/home.json';

    /**
     * URL search parameters
     */
    export let queryParams: Record<string, string>;

    /** Language object */
    const langObj: Record<string, Record<string, string>> = {
        ru: {
            img: imgFlagRu,
            name: 'Русский'
        },
        en: {
            img: imgFlagEn,
            name: 'English'
        }
    };

    /** User form data */
    const formData = {
        name: '',
        room: ''
    };

    /** i18n */
    let translate = i18n(trFormValidation, trHome);

    /** Language select popover state */
    let isSelectingLang = false;

    function generateRoomId(): void {
        formData.room = 'kcall-xxxx-xxxx'.replaceAll(/x/g, () => Math.floor(Math.random() * 9).toString())
    }

    function handleSubmitForm(): void {
        const preparedName = formData.name.trim().split(' ').filter(Boolean).join(' ');

        if (!preparedName.trim()) return notify.error({
            message: translate('no_name')
        });

        // Check name length
        if (preparedName.length < 2 || preparedName.length > 30) return notify.error({
            message: translate('invalid_name_length')
        });

        // Check name format
        if (!(/^[A-zА-я0-9 ]{2,30}$/.test(preparedName))) return notify.error({
            message: translate('invalid_name_format')
        });

        // Check room id
        if (!formData.room.trim()) return notify.error({
            message: translate('no_id')
        });

        // Check room length
        if (formData.room.length < 2 || formData.room.length > 15) return notify.error({
            message: translate('invalid_id_length')
        });

        // Check room format
        if (/[!@#$%^&*()\[\] ]/.test(formData.room)) return notify.error({
            message: translate('invalid_id_format')
        });

        localStorage.setItem('last-used-name', preparedName);
        location.href = `/room/${formData.room}`;
    }

    function changeLanguage(value: string): void {
        $language = value as typeof $language;
        translate = i18n(trFormValidation, trHome);
        localStorage.setItem('language', value);
        isSelectingLang = false;
    }

    onMount(() => {
        formData.name = queryParams.name
            ?? localStorage.getItem('last-used-name')
            ?? '';
    });
</script>

<div class="home-page">
    <form on:submit|preventDefault={handleSubmitForm}>
        <div class="text">
            <h1>{translate('greetings')}</h1>
            <FormGroup label={translate('name_label')} bind:value={formData.name} />
            <FormGroup label={translate('id_label')} bind:value={formData.room}>
                <button type="button" class="secondary" on:click={generateRoomId}>{translate('id_generate')}</button>
            </FormGroup>
            <button type="submit" class="accent">
                <span>{translate('join')}</span>
                <ArrowRight size={16} color="white" weight="bold" />
            </button>
        </div>
        <div class="cover">
            <img src={imgPoster} alt="poster">
        </div>
    </form>

    {#if isSelectingLang}
        <div class="language-select" transition:slide={{duration: 200}}>
            {#each ['en', 'ru'] as lang}
                <button class="language-item" on:click={() => changeLanguage(lang)}>
                    <img src={langObj[lang]?.img} alt="{lang}">
                    <span>{langObj[lang]?.name}</span>
                </button>
            {/each}
        </div>
    {/if}
    <button class="language" on:click={() => isSelectingLang = !isSelectingLang}>
        <img src="{langObj[$language].img}" alt="{$language}">
        <span>{langObj[$language].name}</span>
    </button>
</div>

<style lang="scss">
    .home-page {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;

      .language-select {
        position: fixed;
        z-index: 10;
        right: 16px;
        bottom: calc(16px + 32px + 16px);
        border: 1px solid var(--panel);
        padding: 16px;
        border-radius: var(--round-l);
        border-bottom-right-radius: 0;
        display: flex;
        flex-flow: column;
        align-items: stretch;

        button.language-item {
          padding: 8px;
          background: var(--panel);
          font: 500 14px Inter, Roboto, sans-serif;
          color: white;
          border: 1px solid rgba(white, .25);

          &:not(:last-child) {
            margin-bottom: 8px;
          }

          img {
            height: 20px;
          }
        }
      }

      .language {
        position: fixed;
        z-index: 10;
        right: 16px;
        bottom: 16px;
        padding: 8px;
        font: 500 15px Inter, Roboto, sans-serif;
        color: white;
        border: 1px solid rgba(white, .25);
        background: var(--panel);

        img {
          height: 20px;
        }
      }

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
