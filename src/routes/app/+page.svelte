<script lang="ts">
  import add_bottle_icon from '$lib/images/add_bottle_icon.svg';
  import up10_button from '$lib/images/up10_button.svg';
  import up100_button from '$lib/images/up100_button.svg';
  import down10_button from '$lib/images/down10_button.svg';
  import down100_button from '$lib/images/down100_button.svg';

  export let data;

  // 좌클릭으로 추가 우클릭으로 제거
  // 모바일에서는 드래그 위/아래로 추가/제거
  // 우측 상단 삭제 버튼으로 삭제 가능

  function focusBottle(bottle_name: string): void {
    (document.querySelector('.backdrop-blur') as HTMLDivElement).classList.add('active');
  }
</script>
<div class="koktail-button">kok-tail!</div>

<div class="bottles-frame">
  {#each data.bottles as bottle (bottle)}
    <div class="bottle-container {bottle.key}">
      <img
        class="{bottle.key} bottles"
        alt={bottle.name}
        src={`/images/bottles/${bottle.src}.svg`}
      />

      <div class="caption">
        <span class="name">{bottle.name}</span>
        <span class="ml">{bottle.ml}mL</span>
        <input type="checkbox" name={bottle.key} class="select-bottles">
      </div>

      <div class="controller">
        <img class="up100-button" src={up100_button} alt="add 100ml">
        <img class="up10-button" src={up10_button} alt="add 10ml">
        <img class="down10-button" src={down10_button} alt="substract 10ml">
        <img class="down100-button" src={down100_button} alt="substract 100ml">
      </div>
    </div>
  {/each}

  <div class="add-bottle-container">
    <img class="add-bottle" src={add_bottle_icon} alt="add bottle icon">
  </div>
</div>

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
    font-size: 16px;
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
      display: flex;
      width: $BOTTLE_CONT_WIDTH;

      .bottles {
        margin: 0 auto;
        transition: all 180ms;
        cursor: pointer;
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
        font-size: 15px;
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