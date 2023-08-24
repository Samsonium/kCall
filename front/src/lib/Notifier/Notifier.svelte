<script lang="ts">
    import {slide} from 'svelte/transition';
    import NotificationCard from './NotificationCard.svelte';
    import Notification from '../../utils/Notification';

    const { store: notifications } = Notification;
    const animConf = {
        duration: 150
    };
</script>

<div class="notifications-box">
    {#each $notifications as notification (notification.id)}
        <div class="notification-card-box" transition:slide={animConf}>
            <NotificationCard {...notification} />
        </div>
    {/each}
</div>

<style lang="scss">
    .notifications-box {
      position: fixed;
      z-index: 101;
      bottom: 16px;
      right: 16px;
      width: 300px;
      max-width: calc(100vw - 32px);
      display: flex;
      flex-flow: column-reverse;
      align-items: stretch;
    }
</style>
