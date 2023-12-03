<script lang="ts">
  import search_icon from "$lib/images/search-icon.svg";
  import unknown_cocktail from "$lib/images/unknown-cocktail.svg";
  import { onMount, tick } from "svelte";
  import { recipes_data } from "$lib/data/recipes";
  import { ingredients_data } from "$lib/data/ingredients";
  
  // const BASE_URL = '/u2301415';
  const BASE_URL = '';

  export let data: any;

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
    data?: string,
  }

  interface SearchOption {
    key: string;
    value?: string;
    range?: [number, number];
    inlclude?: boolean;
    data?: string;
  }

  const recipes: Recipe[] = [];

  let list_element: HTMLDivElement;
  let search_text: string;
  let search_result: Recipe[] = [];
  let selected_cocktail: string = "unknown";
  let selected_cocktail_obj: Recipe | undefined;
  let search_type = "all";
  
  // const params = new URLSearchParams(window.location.search);
  // const fromurl: string | null = params.get("key");

  onMount(async () => {
    for (const recipe of recipes_data) {
      const res = await fetch(`/images/glasses/${recipe.glass}.svg`);
      const svg_text = await res.text();
      const parser = new DOMParser();
      const svg = parser.parseFromString(svg_text, "image/svg+xml");
      // r이 Recipe 라는걸 명시해줘야한다
      const r: Recipe = {
        name: recipe.name,
        key: recipe.key,
        svg: svg,
        color: recipe.color,
        type: 'original',
        description: recipe.description,
        author: null,
        ingredients: recipe.ingredients as RecipeIngredients,
      };
      recipes.push(r);
    }
    
    for (const recipe of data.CustomRecipes) {
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

    search_result = [...recipes];

    updateGlasses();
  })

  function isKeyOfRecipe(key: string, recipe: Recipe): key is keyof Recipe {
    return key in recipe;
  }

  function searchRecipe(options: SearchOption[]) {
    let results: Recipe[] = [...recipes];

    for (let option of options) {
      if ('value' in option) {
        results = results.filter((alcohol: Recipe) => {
          if (isKeyOfRecipe(option.key, alcohol) && typeof alcohol[option.key] == 'string') {
            /** 앞에서 typeof로 이미 string인게 확정됐다 */
            const target_txt = (alcohol[option.key] as string)
            return target_txt.includes(option.value ?? "")
          }
        });
      }
    }

    search_result = results.sort();

    if ((document.querySelector('input#kok') as HTMLInputElement).checked) {
      const hasIngredients = (data.Ingredients as any[]).map(ig => ig.keyname);

      search_result = search_result.filter(recipe => {
        return Object.keys(recipe.ingredients).every(ingrdnt => hasIngredients.includes(ingrdnt));
      });

      console.log(search_result);
    }

  }

  async function updateGlasses() {
    await tick();

    for (const recipe of search_result) {
      const liquid = recipe.svg.querySelectorAll(".inner");

      for (let i = 0; i < 6; i++) {
        liquid[i]?.setAttribute("fill", recipe.color[Math.floor(recipe.color.length / 6 * i)]);
      }
      
      const targetObject = document.querySelector(`.${recipe.key} .image`) as HTMLObjectElement;
      recipe.data = URL.createObjectURL(new Blob([recipe.svg.documentElement.outerHTML], {
        type: "image/svg+xml"
      }));
    }

    search_result = [...search_result];
  }

  /** 칵테일이 선택됐을 때 내용 바꿈 */
  function getSelectCocktail(key: string) {
    // .selected 클래스가 있다면 제거
    list_element.querySelector('.selected')?.classList.remove('selected');
    selected_cocktail = key;
    const element = list_element.querySelector(`#${key}`);
    if (element) element.classList.add('selected');

    // 선택된 칵테일을 디테일 영역에 표시
    selected_cocktail_obj = recipes.find(r => r.key == key);

    if (selected_cocktail_obj) {
      const detail_img_element = document.querySelector('.detail-img-container .image') as HTMLObjectElement;
      const detail_name_element = document.querySelector('.detail-content .name') as HTMLDivElement;
      const detail_desc_element = document.querySelector('.detail-content .description') as HTMLDivElement;
      const detail_author_element = document.querySelector('.detail-content .author') as HTMLDivElement;
  
      detail_img_element.data = URL.createObjectURL(new Blob([selected_cocktail_obj.svg.documentElement.outerHTML], {
        type: "image/svg+xml"
      }));
      detail_name_element.innerText = selected_cocktail_obj.name;
      detail_desc_element.innerText = selected_cocktail_obj.description;
      detail_author_element.innerText = selected_cocktail_obj.author || "original";
    } else {
      console.error("Can't find this key in recipes data:", key);
    }
  }

  $: search_result;
</script>

<label class="search-area">
  <input
    type="text" 
    class="area"
    bind:value={search_text}
    on:input={function () {
      if (search_type == "all") {
        searchRecipe([{key: "name", value: this.value}])
      } else {
        searchRecipe([{key: "name", value: this.value}, {key: "type", value: search_type}])
      }
    }}
    placeholder="검색어를 입력해주세요."
  >
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
  <div>

  </div>
</label>

<div class="search-filters-container">
  <input type="radio" name="only" class="search-filter" id="all" checked on:click={function () {search_type = this.id; searchRecipe([{key: "name", value: search_text}])}}>
  <label for="all">모두</label>
  <input type="radio" name="only" class="search-filter" id="custom" on:click={function () {search_type = this.id; searchRecipe([{key: "name", value: search_text}, {key: "type", value: search_type}])}}>
  <label for="custom">커스텀만</label>
  <input type="radio" name="only" class="search-filter" id="original" on:click={function () {search_type = this.id; searchRecipe([{key: "name", value: search_text}, {key: "type", value: search_type}])}}>
  <label for="original">오리지널만</label>
  <input type="checkbox" name="kok" class="search-filter" id="kok" on:click={function () {
    if (search_type == "all") {
      searchRecipe([{key: "name", value: search_text}])
    } else {
      searchRecipe([{key: "name", value: search_text}, {key: "type", value: search_type}])
    }
  }}>
  <label for="kok">만들 수 있는 칵테일만</label>
</div>

<section class="content-box">
  <div class="detail-container">
    <div class="detail-img-container">
      <object class="image" type="image/svg+xml" data={unknown_cocktail} title="detail-image"></object>
    </div>
    <div class="detail-content">
      <h2 class="name">칵테일 이름</h2>
      <div class="description">칵테일 설명...</div>
      <div class="ingredients-container">
        <ul>
        {#if selected_cocktail_obj != undefined}
        {#each Object.entries(selected_cocktail_obj.ingredients) as ingredient}
          <li class="ingredient-name">
            <span class="name">{ingredients_data.find(ig => ig.key == ingredient[0])?.name ?? ingredient[0]}</span>
            <span class="volume">{ingredient[1]}ml</span>
          </li>
        {/each}
        {/if}
        </ul>
      </div>
      <div class="author">지은이</div>
    </div>
  </div>
  <div class='list-container' bind:this={list_element} on:wheel={event => {
      event.preventDefault();
      event.currentTarget.scrollLeft += event.deltaY * 3;
    }}>
    {#each search_result as recipe (recipe)}
      <div id={recipe.key} class="{recipe.key} recipe-container" on:pointerup={function () {getSelectCocktail(recipe.key)}}>
        <object class="image" type="image/svg+xml" data={recipe.data} title={recipe.name}></object>
        <div class="name">{recipe.name}</div>
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  @import './+page.scss';
</style>