<!-- 
  TODO: 커스텀 칵테일 설정 ui 만들기
  TODO: 랜덤 이름 생성기
 -->

<script lang="ts">
  import { onMount } from "svelte";
  import { glasses_data } from "../../data/glasses";
  import { alcohols_data } from "../../data/alcohols";
  import MaterialWindow from "../MaterialWindow.svelte";

  interface Material {
    name: string;
    key: string;
    ml: number;
    color: string;
  }

  const ChangeAnimatekeyframes = [
    {transform: "none"},
    {transform: "translateY(-4px)"},
    {transform: "translateY(2px)"},
    {transform: "none"},
  ];
  const ChangeAnimateOptions = {
    duration: 180,
    easing: "ease-in"
  };

  let cocktail: {
    name: string;
    glass: string;
    color: string[];
    materials: Material[];
    description: string,
  } = {
    name: "",
    glass: "cocktail_glass",
    color: [],
    materials: [],
    description: "",
  }
  
  function updateCocktail() {
    const cup = document.querySelector("object.preview-cocktail") as HTMLObjectElement;
    const preview = document.querySelector(".preview-cocktail") as HTMLObjectElement;
    const liquid = preview.contentDocument?.querySelectorAll(".inner") as NodeListOf<Element>;
    cup.animate(ChangeAnimatekeyframes, ChangeAnimateOptions);

    cocktail.color = [];
    const color_inputs = document.querySelectorAll("input[name='color']") as NodeListOf<HTMLInputElement>;

    for (let i = 0; i < 3; i++) {
      if (color_inputs[i].value != "#000000") {
        cocktail.color.push(color_inputs[i].value);
      }
    }

    if (cocktail.color.length == 0) cocktail.color = ["#e35959"];

    for (let i = 0; i < 6; i++) {
      liquid[i]?.setAttribute("fill", cocktail.color[Math.floor(cocktail.color.length / 6 * i)]);
    }

    if (cocktail.color.length > 0 && cocktail.name != "") {
      // document.querySelector(".submit-option").
    }
    return;
  }

  let draggedMaterialBox: Material|null = null;

  function materialBoxDragStart(event: Event, item: Material) {
    draggedMaterialBox = item;
  }

  function materialBoxDragging(event: Event, item: Material) {
    if (draggedMaterialBox) {
      const dragIdx = cocktail.materials.indexOf(draggedMaterialBox);
      const dropIdx = cocktail.materials.indexOf(item);

      cocktail.materials = [
        ...cocktail.materials.slice(0, dragIdx),
        ...cocktail.materials.slice(dragIdx + 1),
      ]; // drag했던 부분의 index를 제외하고 모두 집어넣고, 칵테일 재료 배열의 drop한 index에 재료 객체를 넣는다.

      cocktail.materials.splice(dropIdx, 0, draggedMaterialBox);
    } else {
      console.warn("Variable draggedMaterialBox is invalid. It's null");
      return false;
    }
  }

  function applyAddMaterials(checksElements: HTMLInputElement[]) {
    for (let element of checksElements) {
      const key = element.id.slice('material-list-'.length);
      const data = alcohols_data.filter(a => a.key == key);
      element.checked = false;

      if (data) {
        const newMaterial = {
          key: key,
          name: data[0].name,
          ml: 10,
          color: data[0].color,
        };
        cocktail.materials.push(newMaterial);
      } else {
        console.error("다음 키는 재료 데이터에 존재하지 않습니다: "+key);
      }
    }

    updateCocktail();
  }

  function deleteMaterial(material: Material) {
    const idx = cocktail.materials.indexOf(material);
    cocktail.materials.splice(idx, 1);

    updateCocktail()
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

  onMount(() => {
    document.querySelector("input#"+cocktail.glass)?.setAttribute("checked", "checked");
  })
</script>

<section class="custom-cocktail">
  <section class="preview-container">
    <object class="preview-cocktail" data="/images/glasses/{cocktail.glass}.svg" type="image/svg+xml" title="glass"
    on:load={updateCocktail}></object>
  </section>
  
  <section class="settings-container">
    <input type="text" class="create-name" placeholder="이름을 지어주세요" on:input={function() {
      cocktail.name = this.value;
    }}>
    <div class="description-container">
      <textarea class="cocktail-description" placeholder="칵테일에 대한 설명을 덧붙여주세요." on:input={function() {
        cocktail.description = this["bind:innerText"] || "";
      }}></textarea>
    </div>
    <div class="select-glass">
    <div class="tab-title"><img src="/images/cup_icon.svg" class="icon" alt="icon"/>칵테일 잔</div>
      <div class="tab select-tab">
        {#each glasses_data as glass (glass)}
        <input type="radio" name="glass" id="select-glass-{glass.key}" class={glass.key}>
        <label for="select-glass-{glass.key}" on:pointerup={() => {cocktail.glass = glass.key;}}>{glass.name}</label>
        {/each}
      </div>
    </div>
    <div class="select-color">
      <div class="tab-title"><img src="/images/cup_icon.svg" class="icon" alt="icon"/>칵테일 색상</div>
      <!-- color는 s(60-90) v(60-90)이 적당 -->
      <div class="tab select-tab">
        <input type="color" name="color" id="floor-1" on:change={updateCocktail}>
        <input type="color" name="color" id="floor-2" on:change={updateCocktail}>
        <input type="color" name="color" id="floor-3" on:change={updateCocktail}>
      </div>
    </div>
    <div class="select-material">
      <div class="tab-title"><img src="/images/cup_icon.svg" class="icon" alt="icon"/>칵테일 재료</div>
      <div class="tab-description">넣는 순서에 유의하여 입력해주세요!</div>
      <div class="tab select-tab">
        <ul class="material-list">
          <!-- svg 파일에서 색을 뽑아서 알맞게 배경색에 그라데이션을 넣든 한다 -->
          {#each cocktail.materials as material (material)}
          <li class="material-box {material == draggedMaterialBox ? "dragging" : ""}" id={material.key}
            style="background: {material.color}a0; border-color: {material.color}80;"
            on:dragstart = {(event) => materialBoxDragStart(event, material)}
            on:dragover|preventDefault = {(event) => materialBoxDragging(event, material)}
            on:drop|preventDefault = {() => {draggedMaterialBox = null}}
            on:dragend|preventDefault = {() => {draggedMaterialBox = null}}
            on:mouseover={({ target }) => {if (target instanceof HTMLElement) target.style.borderColor = `${material.color}`;}}
            on:mouseout={({ target }) => {if (target instanceof HTMLElement) target.style.borderColor = `${material.color}40`;}}
            on:focus={({ target }) => {if (target instanceof HTMLElement) target.style.borderColor = `${material.color}`;}}
            on:blur={({ target }) => {if (target instanceof HTMLElement) target.style.borderColor = `${material.color}40`;}}
            draggable="true"
          >
            <img class="grab-icon" src="/images/menu.svg" alt={material.key}>
            <span class="name">{material.name}</span>
            <span class="ml">{material.ml}mL</span>
            <button class="material-icons delete-icon" on:click={() => {deleteMaterial(material)}}>&#xe5cd;</button>
          </li>
          {/each}
          <button class="add-material" on:click={() => showAddMaterialWin(true)}>
            <img src="/images/add_icon.svg" alt="add material">
          </button>
        </ul>
      </div>
    </div>
    <input type="submit" class="submit-option" value="완료">
  </section>
  <div class="scroll-cover"></div>
</section>

<MaterialWindow callback={applyAddMaterials} />

<style lang="scss">

  .custom-cocktail {
    position: relative;
    display: flex;
  }

  .preview-container {
    position: relative;
    width: 50%;
    height: 100vh;
    border-right: 2px solid $bright-black;

    .preview-cocktail {
      position: absolute;
      left: 50%;
      bottom: calc(50% - 200px);
      scale: 1.4;
      translate: -50% -20%;
    }
  }

  .scroll-cover {
    position: absolute;
    right: 4px;
    bottom: 0;
    width: calc(50% + 4px);
    background: linear-gradient(#00000000, $background-black, $background-black);
    height: 100px;
    z-index: 50;
  }

  .settings-container {
    position: relative;
    display: flex;
    flex-direction: column;

    height: calc(100vh - 48px);
    width: calc(50% - 48px);

    padding: 24px 32px;
    overflow-y: scroll;

  }

  .settings-container .create-name {
    border-bottom: 1px solid $active-black;
    padding: 20px 22px;
    font-size: 1.5em;
    font-weight: 700;
    margin: 6px 0px 4px 0px;
    color: $white;
    
    &:focus {
      /* padding: 32px 22px; */
      /* margin: 0px 0px; */
      /* background: #0c0c0c; */
      border-color: $bright-black;
    }
  }

  .settings-container .description-container {
    margin-top: 8px;

    .cocktail-description {
      outline: none;
      padding: 4px 12px;
      background-color: transparent;
      resize: none;
      font-size: 1em;
      border: none;
      width: calc(100% - 24px);
      font-weight: 500;
      color: #b8b8b8;
    }
  }

  .settings-container {
    .tab-title{
      font-size: 1.2em;
      font-weight: 900;
      color: $white;
      margin: 30px 0 20px 10px;
      display: flex;
      gap: 8px;
      align-items: center;
  
      .icon {
        height: 1em;
      }
    }

    .tab-description {
      font-size: 1em;
      color: $gray;
      margin: -14px 0 20px 10px;
    }
  }

  .settings-container .select-glass .select-tab {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;

    input[type="radio"] {
      display: none;
      
      +label {
        padding: 8px 13px;
        color: $white;
        border: 1px solid $active-black;
        float: left;
        border-radius: 4px;
        color: $bright-black;
        transition-duration: 350ms;
        cursor: pointer;
        font-size: 1em;
        
        &:hover {
          color: gray;
          border-color: gray;
          transition: all 80ms;
        }
      }

      &:checked+label {
        border-color: $white;
        color: $background-black;
        background: $white;
        font-weight: 600;
      }
    }
  }

  .settings-container .select-color {
    .select-tab {
      display: flex;
      justify-content: space-around;

      input[name="color"] {
        border: none;
        width: 48px;
        height: 50px;
        appearance: none;
        background-color: transparent;

        &::-webkit-color-swatch {
          border-radius: 20px;
          border: 2px solid #ffffff40;
          box-shadow: 0px 6px 12px #80808040;
          transition: all 200ms ease-out;
          cursor: pointer;
          
          &:hover, &:active {
            translate: 0 -4px;
            border-color: #ffffff80;
            box-shadow: 0px 10px 16px #80808060;
          }
        }
      }
    }
  }

  .submit-option {
    position: fixed;
    right: 112px;
    bottom: 32px;
    font-size: 1em;
    color: $white;
    background: $point-pink;
    border: none;
    border-radius: 6px;
    padding: 9px 32px;
    font-weight: 700;
    cursor: pointer;
    z-index: 51;

    &:hover {
      background: $dark-point-pink;
    }
  }
  .settings-container .select-material {
    
    .material-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0;
      list-style: none;
    }

    .material-list .material-box {
      position: relative;
      width: calc(100% - 46px - 48px - 24px);
      margin: 0 11px;
      padding: 9px 46px 9px 46px;
      background: #282828;
      border-radius: 20px;
      cursor: pointer;
      border: 2px solid #282828;
      transition: all 120ms;
      
      span {
        display: inline-block;
        /* position: absolute; */
        font-size: 1em;
        font-weight: 600;
        color: $white;
        transition: all 80ms;
      }

      .name {
        float: left;
      }
      
      .ml {
        float: right;
        opacity: 0.5;
      }

      .grab-icon {
        position: absolute;
        left: 16px;
        top: calc(50% - 10px);
      }
      
      .delete-icon {
        position: absolute;
        font-weight: 800;
        cursor: pointer;
        right: 4px;
        font-size: 1.2em;
        top: 50%;
        translate: 0 -50%;
        padding: 12px;
        transition: all 150ms;
        background: none;
        border: none;
        color: $white;

        &:hover {
          opacity: 25%;
        }
      }

      &:has(> .delete-icon) {
        background: red;
      }

      &.dragging {
        filter: brightness(115%);
        scale: 1.025;
      }
    }

    button.add-material {
      width: calc(100% - 22px);
      margin: 0 11px;
      margin-bottom: 80px;
      padding: 8px;
      background: $background-black;
      border: 2px solid $white;
      border-radius: 20px;
      filter: brightness(25%);
      cursor: pointer;

      img {
        height: 1.2em;
      }

      &:hover {
        filter: brightness(35%);
      }
    }
  }
</style>