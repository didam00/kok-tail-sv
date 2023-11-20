<script lang="ts">
  import { alcohols_data } from "../data/alcohols";

  function showAddMaterialWin(show?: boolean) {
    const win = document.querySelector(".add-material-window") as HTMLDivElement;
    if (show == null) show = win.classList.contains("hide");

    if (show) {
      win.classList.remove("hide");
      document.querySelector(".hide-back")?.classList.remove("hide");
    } else {
      win.classList.add("hide");
      document.querySelector(".hide-back")?.classList.add("hide");
    }
  }

  export let callback: Function;
</script>

<div class="add-material-window hide">
  <h3 class="title">재료 선택</h3>
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
    <button class="continue" on:click={function () {showAddMaterialWin(false); callback([...document.querySelectorAll(".add-material-window .material-list input[name='materials']:checked")])}}>완료</button>
    <button class="cancle" on:click={() => {showAddMaterialWin(false);}}>취소</button>
  </div>
</div>

<style lang="scss">
  .add-material-window {
    display: flex;
    flex-direction: column;
    opacity: 1;
    position: fixed;
    left: 50%; top: 50%;
    translate: -50% -50%;
    width: 540px;
    padding: 24px 24px;
    background: #00000088;
    z-index: 99;
    border-radius: 8px;
    border: 1px solid $bright-black;
    backdrop-filter: blur(16px);
    box-shadow: 0px 6px 12px #00000080;

    h3 {
      color: $white;
      font-size: 1.5em;
      font-weight: 800;
      text-align: center;
      margin: 0;
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
    
    button.continue {
      border: none;
      color: $white;
      background-color: $active-black;
      
      &:hover {
        background-color: $bright-black;
      }
    }
  }
  
  .hide {
    display: none;
    opacity: 0;
  }
</style>