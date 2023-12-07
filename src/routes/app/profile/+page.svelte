<script lang="ts">
  import setting_icon from "$lib/images/menu.svg";
  import { onMount, tick } from "svelte";

  export let data;

  interface RecipeIngredients {
    [key: string]: number
  }

  interface Recipe {
    name: string;
    key: string;
    svg: Document;
    color: string[];
    type: 'original' | 'custom';
    author: string | null;
    // proof: number;
    description: string;
    ingredients: RecipeIngredients;
  }

  const BASE_URL = '';
  let showMenubar = false;
  let recipes: Recipe[] = [];

  onMount(async () => {
    for (const recipe of data.customRecipes) {
      const svg_response = await fetch(`/images/glasses/${recipe.glass}.svg`);
      const svg_text = await svg_response.text();
      const parser = new DOMParser();
      const svg = parser.parseFromString(svg_text, "image/svg+xml");
      const prefix = "custom_cocktail_"

      const ingrdnts_response = await fetch(`${BASE_URL}/api/getIngredients?recipeId=${recipe.id}`, {
        method: 'GET',
      }).then(res => res.json())

      const ingrdntsObj = (ingrdnts_response.ingredients as {keyname: string, volume: number}[]).reduce((acc: {[key: string]: number}, o) => {
        acc[o.keyname] = o.volume;
        return acc;
      }, {})

      const r: Recipe = {
        name: recipe.name,
        key: `${prefix}${recipe.id}`,
        svg: svg,
        color: recipe.colors.split(","),
        type: 'custom',
        description: recipe.description,
        author: recipe.username,
        ingredients: ingrdntsObj,
      };

      recipes.push(r);
    }

    recipes = [...recipes];

    updateGlasses();
  })

  async function updateGlasses() {
    await tick();

    for (const recipe of recipes) { 
      const liquid = recipe.svg.querySelectorAll('.inner');
  
      for (let i = 0; i < 6; i++) {
        liquid[i]?.setAttribute("fill", recipe.color[Math.floor(recipe.color.length / 6 * i)]);
      }
      
      const targetObject = document.querySelector(`.${recipe.key} .image`) as HTMLObjectElement;
      targetObject.data = URL.createObjectURL(new Blob([recipe.svg.documentElement.outerHTML], {
        type: "image/svg+xml"
      }));
    }
  }

  $: updateGlasses();
</script>

<div class="root-container">
  <!-- <div class="more-container">
    <button on:click={() => {showMenubar = !showMenubar}}>
      <img src={setting_icon} alt="more">
    </button>
    <div class="more-li-container {showMenubar ? '' : 'hide'}">
      <ul>
        <li class="settings"><button>설정</button></li>
        {#if data.users.user}
        <li class="logout"><a href="../logout">로그아웃</a></li>
        {:else}
        <li class="login"><a href="../login">로그인</a></li>
        {/if}
      </ul>
    </div>
  </div> -->
  {#if data.users.user}
  <div class="logout loginout"><a href="../logout">로그아웃</a></div>
  {:else}
  <div class="login loginout"><a href="../login">로그인</a></div>
  {/if}
  
  <section class="profile">
    <div class="profile-image-container">
      <img src="/images/basic-profile-image.png" alt="프로필 이미지">
    </div>
    <div class="name">{data.users.user ? data.users.nickname : "로그인해주세요"}</div>
    <!-- <div class="description">사용자가 지정한 설명 및 자기소개</div> -->
  </section>
  <section class="custom-cocktails">
    <h3 class="title">제작한 칵테일</h3>
    <div class="cocktails-container" on:wheel={event => {
      event.preventDefault();
      event.currentTarget.scrollLeft += event.deltaY * 3;
    }}>
    {#each recipes as recipe (recipe)}
      <div id={recipe.key} class="{recipe.key} recipe-container">
        <object class="image" type="image/svg+xml" data="" title={recipe.name}></object>
        <div class="name">{recipe.name}</div>
      </div>
    {/each}
    </div>
  </section>
</div>

<style lang="scss">
  @import './+page.scss';
</style>