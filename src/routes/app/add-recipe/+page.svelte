<script lang="ts">
  import { onMount } from "svelte";
  import { glasses_data } from "$lib/data/glasses";
  import { ingredients_data } from "$lib/data/ingredients";
  import MaterialWindow from "../../../components/MaterialWindow.svelte";
  import { goto } from "$app/navigation";
  
  interface Material {
    name: string;
    key: string;
    ml: number;
    color: string;
  }

  export let data;
  
  let url: string;
  onMount(() => {
    url = window.location.href;
  })

  let showAddMaterialWin = false;
  let draggedMaterialBox: Material|null = null;
  let formValid = false;

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
    
    return;
  }

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
      const data = ingredients_data.filter(a => a.key == key);

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

  async function postRecipe() {
    if (!formValid) return;

    const response = await fetch('/api/addRecipe', {
      method: "POST",
      body: JSON.stringify({
        data: cocktail
      })
    })

    if (response.ok) {
      goto('./cocktail');
    }
  }

  onMount(() => {
    document.querySelector("input#select-glass-"+cocktail.glass)?.setAttribute("checked", "checked");
  })

  $: {
    formValid = (cocktail.name.trim().length > 0 && cocktail.description.trim().length > 0 && cocktail.color.length > 0 && cocktail.materials.length > 0);
  }
</script>

{#if data.users.user}
<section class="custom-cocktail">
  <section class="preview-container">
    <object class="preview-cocktail" data="/images/glasses/{cocktail.glass}.svg" type="image/svg+xml" title="glass"
    on:load={updateCocktail}></object>
  </section>
  
  <section class="settings-container">
    <form class="custom-recipe-form">
      <input name="name" type="text" class="create-name" placeholder="이름을 지어주세요" bind:value={cocktail.name}>
      <div class="description-container">
        <textarea name="description" class="cocktail-description" placeholder="칵테일에 대한 설명을 덧붙여주세요." bind:value={cocktail.description}></textarea>
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
              <input class="ml" bind:value={material.ml}>
              <button class="material-icons delete-icon" on:click={() => {deleteMaterial(material)}}>&#xe5cd;</button>
            </li>
            {/each}
            <button class="add-material" on:click={() => showAddMaterialWin = true}>
              <img src="/images/add_icon.svg" alt="add material">
            </button>
          </ul>
        </div>
      </div>
      <input type="submit" class="submit-option" value="완료" on:pointerdown={postRecipe} disabled={!formValid}>
    </form>
  </section>
  <div class="scroll-cover"></div>
</section>

<MaterialWindow callback={applyAddMaterials} bind:active={showAddMaterialWin}/>
<!-- bind:active로 MaterialWindow의 active 변수와 연결! -->

{:else}
<!-- ! 로그인이 안되어있을 경우 -->
<section class="no-login">
  <div class="alert">
    <h3>로그인이 필요한 서비스입니다</h3>
    <button class="login-button"><a href="/login?url={url}">로그인</a></button>
  </div>
</section>
{/if}

<style lang="scss">
  @import './+page.scss';

  .no-login .alert {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;

    .login-button {
      display: block;
      margin: 0 auto;
      font-size: 1rem;
      background: $background-black;
      border: 2px solid $gray;
      border-radius: 20px;
      
      a {
        display: block;
        padding: 7px 17px;
        font-weight: 800;
        color: $gray;
        text-decoration: none;
      }
      
      &:hover {
        /* border-color: $white; */
        background: $active-black;
        a {
          /* color: $white; */
        }
      }
    }
  }
</style>