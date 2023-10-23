<script lang="ts">
  import fridge_icon from '$lib/images/fridge_icon.svg';
  import cup_icon from '$lib/images/cup_icon.svg';
  import bottle_icon from '$lib/images/bottle_icon.svg';
  import add_icon from '$lib/images/add_icon.svg';
  import profile_icon from '$lib/images/profile_icon.svg';

  class SideBarTab {
    constructor (public name: string, public src: string, public href: string) {
      this.name = name;
      this.href = '/app'+href;
      this.src = src;
    }
  }

  const side_bar_col: SideBarTab[] = [
    new SideBarTab("fridge", fridge_icon, "/"),
    new SideBarTab("search-cocktail", cup_icon, "/cocktail"),
    new SideBarTab("search-alchol", bottle_icon, "/alchol"),
    new SideBarTab("add-recipe", add_icon, "/add-recipe"),
    new SideBarTab("my-profile", profile_icon, "/profile"),
  ]

  let current_tab = "fridge";
</script>

<div class="side-bar">
  <nav>
    {#each side_bar_col as sb}
      <a href={sb.href} class="tab-icon {sb.name} {current_tab === sb.name ? 'active' : null}"
        on:click={() => {current_tab = sb.name}}>
        <img src={sb.src} alt="{sb.name} tab">
      </a>
    {/each}
  </nav>
</div>

<div class="container">
  <slot />
</div>

<style lang='scss'>
  @import "./mixin";

  :root {
    margin: 0;
    background-color: $background-black;
  }

  .side-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 100%;
    background: $background-black;
    border-right: 2px solid $bright-black;
    z-index: 99;
    box-sizing: border-box;

    .tab-icon {
      padding: 26px;
      display: block;
      transition: all 150ms;

      &.active {
        background: $active-black;
        /* border-right: 2px solid $white; */
      }
    }
  }

  @include mobile {
    .side-bar {
      height: 52px;
      width: 100%;
      bottom: 0;

      .tab-icon {
        float: left;
      }
    }
  }

  .my-profile {
    position: fixed;
    bottom: 0;
  }

  .container {
    width: calc(100vw - 80px);
    height: 100vh;
  }
</style>