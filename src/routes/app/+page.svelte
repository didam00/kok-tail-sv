<script lang="ts">
  import add_bottle_icon from '$lib/images/add_bottle_icon.svg';
  import up_icon from '$lib/images/up_icon.svg';
  import down_icon from '$lib/images/down_icon.svg';

  import MaterialWindow from './MaterialWindow.svelte';
  import { alcohols_data } from '../data/alcohols';

  export let data;

  let hasBottles = [...data.bottles];

  // 좌클릭하면 해당 요소가 어두워지고 가운데에 잔량 표시
  // 스크롤하여 잔량을 조절 가능
  // 모바일에서는 드래그 위/아래로 추가/제거
  // 우측 상단 삭제 버튼으로 삭제 가능

  function focusBottle(bottle_key: string) {
    const bottle = document.querySelector(`.${bottle_key}`) as HTMLElement;
    bottle.classList.add('focused');
  }

  async function unfocusBottle(bottle_key: string) {
    const bottle = document.querySelector(`.${bottle_key}`) as HTMLElement;
    bottle.classList.remove('focused');
  }

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

  function applyAddAlcohols(checksElements: HTMLInputElement[]) {
    const SLICELEN = 'material-list-'.length;
    const keys = checksElements.map(ele => ele.id.slice(SLICELEN));

    for (let key of keys) {
      let alcohol = alcohols_data.find(o => o.key == key);

      if (!alcohol) {
        console.error("다음 키가 alcohols 데이터에 없습니다:"+key);
        continue;
      }

      let newAlcohol = {
        name: alcohol.name,
        key: alcohol.key,
        src: alcohol.src,
        ml: 100,
      }

      hasBottles = [...hasBottles, newAlcohol];
    }

    console.log(hasBottles)
  }
</script>

<div class="koktail-button">kok-tail!</div>

<div class="bottles-frame">
  {#each hasBottles as bottle (bottle)}
    <div class="bottle-container {bottle.key}"
      on:pointerdown={() => focusBottle(bottle.key)}
      on:pointerleave={() => unfocusBottle(bottle.key)}
    >
      <img
        class="{bottle.key} bottles"
        alt={bottle.name}
        src={`/images/bottles/${bottle.src}.svg`}
      />

      <div class="focus-ml" on:wheel={
        (event) => {
          const val = event.deltaY;
          const unit = event.shiftKey ? 1 : 10;
          if (val > 0) {
            bottle.ml -= unit;
          } else {
            bottle.ml += unit;
          }
          if (bottle.ml < 0) {
            bottle.ml = 0;
          }
        }
      } class:empty={bottle.ml <= 0}>
        <img src={up_icon} alt="up icon">
        <span class="ml">{bottle.ml}mL</span>
        <img src={down_icon} alt="down icon">
      </div>

      <div class="caption">
        <span class="name">{bottle.name}</span>
        <span class="ml">{bottle.ml}mL</span>
        <input type="checkbox" name={bottle.key} class="select-bottles">
      </div>
    </div>
  {/each}

  <button class="add-bottle-container" on:click={showAddMaterialWin}>
    <img class="add-bottle" src={add_bottle_icon} alt="add bottle icon">
  </button>

</div>
<MaterialWindow callback={applyAddAlcohols}/>

<style lang="scss">
  @import "./mixin";
  $BOTTLE_CONT_WIDTH: 100px;

  .koktail-button {
    position: absolute;
    z-index: 1;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    color: $white;
    background-color: $background-black;
    border: 2px solid $white;
    font-size: 1em;
    font-weight: 700;
    padding: 9px 24px;
    border-radius: (15px + 10px);
    cursor: pointer;
    transition: all 180ms;

    &:hover {
      /* background-color: $white;
      color: $background-black; */
      color: $white;
      background-color: $point-pink;
      border-color: $point-pink;
    }
  }

  .bottles-frame {
    display: flex;
    position: absolute;
    transform: translateX(-50%);
    left: calc(50% + 40px);
    bottom: calc(15% + 100px);
    width: 100%;
    height: 400px;
    justify-content: center;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;

    ::scrollbar-width {
      width: 0;
    }

    .bottle-container {
      position: relative;
      display: flex;
      width: $BOTTLE_CONT_WIDTH;

      &.focused {
        .focus-ml {
          opacity: 1;
          display: flex;
        }

        img {
          opacity: 33%;
        }
      }
      
      .focus-ml {
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        opacity: 0;

        .ml {
          color: $white;
          font-weight: 700;
        }

        &.empty .ml {
          color: $red;
        }
      }

      .bottles {
        margin: 0 auto;
        transition: all 180ms;
      }

      .bottles-back {
        opacity: 0.25;
        position: absolute;
        margin-left: calc($BOTTLE_CONT_WIDTH / 2);
        transform: translateX(-50%);
        transition: all 180ms;
      }

      &:hover .bottles {
        transform: translateY(-16px);
      }

      &:hover .bottles-back {
        transform: translateX(-50%) translateY(-16px);
      }

      .controller {
        display: none;
      }

      &:hover .caption {
        .name, .ml {
          opacity: 100%;
          /* letter-spacing: 0px; */
        }
      }
      
      .caption {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        text-align: center;
        margin-top: 10px;
        font-size: 0.9em;
        line-height: 22px;
        width: $BOTTLE_CONT_WIDTH;
        transition: all 180ms;
        
        .name {
          color: $white;
          opacity: 25%;
        }
  
        .ml {
          color: gray;
          opacity: 25%;
        }

        input.select-bottles {
          position: absolute;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid $bright-black;
          box-sizing: border-box;
          cursor: pointer;
          margin: 0;

          transition: all 150ms;
          
          &:hover {
            border-color: $white;
          }

          &:checked {
            border-color: $white;
            background-color: $white;
          }
        }
      }
    }
  }

  .add-bottle-container {
    height: 100%;
    width: $BOTTLE_CONT_WIDTH + 20px;
    display: flex;
    background: none;
    border: none;

    .add-bottle {
      position: absolute;
      bottom: 40px;
      cursor: pointer;
      transition: all 80ms;
      transform: translateX(calc(($BOTTLE_CONT_WIDTH + 20px) / 2 - 50%));

      &:hover {
        filter: brightness(50%);
      }
    }
  }
</style>