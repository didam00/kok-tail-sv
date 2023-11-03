<script lang="ts">
  import arrow_icon from "$lib/images/arrow.svg";
  import search_icon from "$lib/images/search-icon.svg";
  import { alcohols_data } from "../../data/alcohols";
</script>

<label class="search-area">
  <input type="text" class="area">
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
</label>
<div class='info-box'>
  {#each alcohols_data as alcohol (alcohol)}
    <div class="{alcohol.key} alchol-container">
      <img class="alchol-img" src="/images/bottles/{alcohol.src}.svg" alt="">
      <div class="name">{alcohol.name}</div>
      <div class="description">{alcohol.description}</div>
      <img class="arrow-icon" src={arrow_icon} alt="arrow icon">
    </div>
  {/each}
</div>

<style lang='scss'>
  .info-box {
    display: flex;
    flex-direction: column;
    width: calc(100% - 400px);
    height: calc(100vh - (44px + 48px + 24px));
    margin: 0 auto;
    overflow-y: scroll;

    .alchol-container {
      position: relative;
      border-bottom: 1px solid $active-black;
      padding-right: 16px;
      box-sizing: border-box;
      transition: all 100ms;

      &:last-child {
        border-bottom: none;
      }

      .alchol-img {
        height: 80px;
        width: 100px;
        float: left;
        margin: 24px 4px 24px 0px;
      }
      
      .name, .description {
        font-size: 16px;
        padding: 4px 0;
      }

      .name {
        margin-top: 28px;
        font-weight: 700;
        color: $white;
      }
      
      .description {
        margin-bottom: 32px;
        color: gray;
      }

      .arrow-icon {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        height: 24px;
        width: 24px;
        cursor: pointer;
        transition: all 180ms;
        padding: 24px;

        &:hover {
          filter: brightness(0.5);
        }
      }

      &:hover {
        background: #101010;
      }
    }
  }
</style>