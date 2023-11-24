<script lang="ts">
  import search_icon from "$lib/images/search-icon.svg";

  export let search_text: string;
  export let oninput: Function;
</script>

<label class="search-area">
  <input type="text" bind:value={search_text} class="area" on:input={() => {oninput()}}>
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
</label>

<style lang="scss">
.search-area {
  display: block;
  position: relative;
  margin: 48px auto 24px auto;
  width: calc(100% - 600px);
  padding: 12px 16px;
  min-width: 800px;
  border-radius: 24px;
  background: $active-black;
  border: 2px solid $bright-black;
  box-sizing: border-box;

  &:hover {
    border-color: $brighter-black;
  }

  .area {
    width: calc(100% - 32px);
    outline: none;
    border: none;
    background: transparent;
    color: $white;
    font-weight: 700;
    font-size: 1em;
  }

  .search-icon {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    height: 18px;
    width: 18px;
  }
}
</style>