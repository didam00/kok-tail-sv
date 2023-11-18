<script lang="ts">
  import fridge_icon from '$lib/images/fridge_icon.svg';
  import cup_icon from '$lib/images/cup_icon.svg';
  import bottle_icon from '$lib/images/bottle_icon.svg';
  import add_icon from '$lib/images/add_icon.svg';
  import profile_icon from '$lib/images/profile_icon.svg';
  import { onMount } from 'svelte';

  class SideBarTab {
    constructor (public name: string, public src: string, public href: string) {
      this.name = name;
      this.href = '/app'+href;
      this.src = src;
    }
  }

  const side_bar_col: SideBarTab[] = [
    new SideBarTab("fridge", fridge_icon, ""),
    new SideBarTab("search-cocktail", cup_icon, "/cocktail"),
    new SideBarTab("search-alcohol", bottle_icon, "/alcohol"),
    new SideBarTab("add-recipe", add_icon, "/add-recipe"),
    new SideBarTab("my-profile", profile_icon, "/profile"),
  ]

  let current_tab = "/";

  onMount(() => {
    const current_path = window.location.pathname;
    for (const tab of side_bar_col) {
      if (tab.href == current_path) {
        current_tab = tab.href;
        break;
      }
    }
  });
</script>

<div class="side-bar">
  <nav>
    {#each side_bar_col as tab}
      <a href={tab.href} class="tab-icon {tab.name}" class:active={current_tab == tab.href}
      on:click={() => {current_tab = tab.href}}>
          <img src={tab.src} alt="{tab.name} tab">
        </a>
    {/each}
  </nav>
</div>

<div class="hide-back hide"></div>

<div class="slot-container">
  <slot />
</div>

<style lang='scss'>
  @import "./mixin";

  $SIDE-BAR-WIDTH: 80px;

  :root {
    margin: 0;
    background-color: $background-black;
  }

  .hide-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
    transition: all 250ms;
  }

  .side-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: $SIDE-BAR-WIDTH;
    height: 100%;
    background: $background-black;
    border-right: 2px solid $bright-black;
    z-index: 89;

    nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .tab-icon {
      padding: 26px;
      display: block;
      transition: all 150ms;

      &:hover {
        background: #101010;
      }

      &.active img {
        filter: brightness(0.25);
      }
    }
  }

  @include mobile {
    .side-bar {
      height: 52px;
      width: 100%;
      bottom: 0;
      flex-direction: row;

      .tab-icon {
        float: left;
      }
    }
  }

  .my-profile {
    
  }

  .slot-container {
    margin: 0 $SIDE-BAR-WIDTH;
  }

  .hide {
    opacity: 0;
    display: none;
  }
</style>