<script lang="ts">
    import {Input} from '$lib';
    import Icon from '$lib/ui/Icon/Icon.svelte';

    // Assets
    import LogoImage from '../../assets/logo.svg';
</script>

<header>
    <div class="content">
        <div class="brand">
            <img src={LogoImage} alt="kCall logo">
            <h2>UIKit</h2>
        </div>

        <Input placeholder="Search components...">
            <Icon name="search" slot="prefix"/>
        </Input>
    </div>
</header>

<style lang="scss">
  @use 'sass:map';

  header {
    width: 100%;
    padding: 0 12px;
    border-bottom: 1px solid map.get($t_light, 'border');

    // Header content
    .content {
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      margin: 0 auto;

      // Brand section (logo + title)
      .brand {
        width: max-content;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        img {
          width: 48px;
          height: 48px;
          margin-right: 12px;
        }

        h2 {
          font: 600 20px 'Noto Sans Display';
          padding: 0;
          margin: 0;
        }
      }
    }
  }
</style>
