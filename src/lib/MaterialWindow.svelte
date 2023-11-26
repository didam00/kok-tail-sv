<script lang="ts">
  import { alcohols_data } from '$lib/data/alcohols';

  export let callback: Function;
  export let active: boolean = false;

  function showAddMaterialWin(show?: boolean) {
    if (show === undefined) active = !active;
    else active = show;

    if (!active) {
      const checkboxes = document.querySelectorAll(".add-material-window .material-list .material-box input") as NodeListOf<HTMLInputElement>;
      for (let checkbox of checkboxes) {
        checkbox.checked = false;
      }
    }
  }
</script>

<div class="add-material-window center-window {active ? 'active' : ''}">
  <h2 class="title">재료 선택</h2>
  <ul class="material-list">
    {#each alcohols_data as alcohol (alcohol)}
    <div class="material-box">
      <input type="checkbox" name="materials" id="material-list-{alcohol.key}" class={alcohol.key}>
      <label for="material-list-{alcohol.key}" class="fake-checkbox"></label>
      <label for="material-list-{alcohol.key}" class="name">{alcohol.name}</label>
    </div>
    {/each}
  </ul>
  <div class="button-container">
    <button class="submit" on:click={function () {callback([...document.querySelectorAll(".add-material-window .material-list input[name='materials']:checked")]); showAddMaterialWin(false);}}>완료</button>
    <button class="cancle" on:click={() => {showAddMaterialWin(false);}}>취소</button>
  </div>
</div>

<div class="hide-back {active ? 'active' : ''}"></div>

<style lang="scss">
  .add-material-window {
    display: none;
    flex-direction: column;
    
    &.active {
      display: flex;
    }
    
    .material-list {
      display: flex;
      flex-direction: column;
      list-style-type: none;
      height: 320px;
      width: 100%;
      overflow-y: scroll;
      padding: 0;
      gap: 12px;

      .material-box {
        display: flex;
        align-items: center;

        input[type="checkbox"] {
          display: none;
          
          &:hover {
            + label.fake-checkbox {
              border-color: $white;
            }
          }
          
          &:checked {
            + label.fake-checkbox {
              border-color: $white;
              background: $white;
            }
          }
        }
        
        label.fake-checkbox {
          width: 8px;
          height: 8px;
          margin-right: 12px;
          border-radius: 50%;
          border: 2px solid $bright-black;
          cursor: pointer;
        }

        label.name {
          color: $white;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
        }        
      }
    }

    .button-container {
      margin-left: auto; // 우측 정렬
    }

    button {
      width: 80px;
      font-size: 0.9em;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 700;
      
    }
    
    button.cancle {
      border: 2px solid $bright-black;
      background: transparent;
      color: $bright-black;
      padding: 6px;

      &:hover {
        background: $active-black;
        color: gray;
      }
    }
  }
</style>