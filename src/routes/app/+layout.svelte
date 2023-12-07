<script lang="ts">
  import fridge_icon from '$lib/images/fridge_icon.svg';
  import cup_icon from '$lib/images/cup_icon.svg';
  import bottle_icon from '$lib/images/bottle_icon.svg';
  import add_icon from '$lib/images/add_icon.svg';
  import profile_icon from '$lib/images/profile_icon.svg';
  import { onMount } from 'svelte';

  const BASE_URL = '';

  class SideBarTab {
    constructor (public name: string, public src: string, public href: string) {
      this.name = name;
      this.href = '/app'+href;
      this.src = src;
    }
  }

  let current_tab = "fridge";

  onMount(() => {
    
  });

  function changeUrl(tabName: string) {
    current_tab = tabName;
  }
</script>

<div class="side-bar">
  <nav>
    <a id="fridge" href="./fridge" 
      class="tab-icon" on:click={function () {changeUrl(this.id || '')}}
      class:active={current_tab == 'fridge'}
    >
      <img src={fridge_icon} alt="fridge">
    </a>
    <a id="alcohol" href="./alcohol" 
      class="tab-icon" on:click={function () {changeUrl(this.id || '')}}
      class:active={current_tab == 'alcohol'}
    >
      <img src={bottle_icon} alt="cup">
    </a>
    <a id="cocktail" href="./cocktail" 
      class="tab-icon" on:click={function () {changeUrl(this.id || '')}}
      class:active={current_tab == 'cocktail'}
    >
      <img src={cup_icon} alt="cocktail">
    </a>
    <a id="add-recipe" href="./add-recipe" 
      class="tab-icon" on:click={function () {changeUrl(this.id || '')}}
      class:active={current_tab == 'add-recipe'}
    >
      <img src={add_icon} alt="add recipe">
    </a>
    <a id="profile" href="./profile" 
      class="tab-icon" on:click={function () {changeUrl(this.id || '')}}
      class:active={current_tab == 'profile'}
    >
      <img src={profile_icon} alt="profile">
    </a>
  </nav>
</div>

<div class="slot-container">
  <slot />
</div>

<style lang='scss'>
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

  .my-profile {
    
  }

  .slot-container {
    margin: 0 $SIDE-BAR-WIDTH;
  }
  
  @include mobile {
    .slot-container {
      margin: 0 16px;
    }

    .side-bar {
      height: 52px;
      width: calc(100% - 16px);
      bottom: 0;
      border: 0;
      padding: 4px 8px 1px 8px;
      border-top: 2px solid $bright-black;
      overflow: hidden;

      // using flex
      nav {
        flex-direction: row;
        justify-content: space-around;
      }
      
      .tab-icon {
        padding: 0 8px;

        &:hover {
          background: $background-black;
        }
      }
    }
  }
</style>