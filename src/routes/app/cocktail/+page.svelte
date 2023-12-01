<script lang="ts">
  import search_icon from "$lib/images/search-icon.svg";
  import { onMount, tick } from "svelte";
  import { recipes_data } from "$lib/data/recipes";

  export let data: {
    CustomRecipes: {[key: string]: any}[]
  };

  interface Recipe {
    name: string;
    key: string;
    svg: Document;
    color: string[];
  }

  interface SearchOption {
    key: string;
    value?: string;
    range?: [number, number],
    inlclude?: boolean;
  }

  const recipes: Recipe[] = [];

  let list_element: HTMLDivElement;
  let search_text: string;
  let search_result: Recipe[] = [];
  let select_cocktail: string = "";

  onMount(async() => {
    for (const recipe of recipes_data) {
      const res = await fetch(`/images/glasses/${recipe.glass}.svg`);
      const svg_text = await res.text();
      const parser = new DOMParser();
      const svg = parser.parseFromString(svg_text, "image/svg+xml");
      const r = {
        name: recipe.name,
        key: recipe.key,
        svg: svg,
        color: recipe.color,
      };
      recipes.push(r);
    }

    for (const recipe of data.CustomRecipes) {
      const res = await fetch(`/images/glasses/${recipe.glass}.svg`);
      const svg_text = await res.text();
      const parser = new DOMParser();
      const svg = parser.parseFromString(svg_text, "image/svg+xml");
      const r = {
        name: recipe.name,
        key: `custom_cocktail_${recipe.id}`,
        svg: svg,
        color: recipe.colors.split(","),
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
  }

  async function updateGlasses() {
    await tick();

    for (const recipe of search_result) {
      const liquid = recipe.svg.querySelectorAll(".inner");

      for (let i = 0; i < 6; i++) {
        liquid[i]?.setAttribute("fill", recipe.color[Math.floor(recipe.color.length / 6 * i)]);
      }
      
      const targetObject = document.querySelector(`.${recipe.key} .image`) as HTMLObjectElement;
      targetObject.data = URL.createObjectURL(new Blob([recipe.svg.documentElement.outerHTML], {
        type: "image/svg+xml"
      }));
    }
  }

  function getSelectCocktail(key: string) {
    // .active 클래스가 있다면 제거
    list_element.querySelector('.select')?.classList.remove('.select');
    console.log(list_element.querySelector('.select'));
    select_cocktail = key;
    const element = list_element.querySelector(`#${key}`);
    console.log(element);
    if (element) element.classList.add('.select');
  }

  $: updateGlasses(), search_result;
</script>

<label class="search-area">
  <input
    type="text" 
    class="area"
    bind:value={search_text}
    on:input={function () {searchRecipe([{key: "name", value: this.value}])}}
    placeholder="검색어를 입력해주세요."
  >
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
</label>

<section class="content-box">
  <div class="detail-container">
    <div class="detail-img-container">
      <object class="image" type="image/svg+xml" data="" title="detail-image"></object>
    </div>
    <div class="detail-content">
      <h2 class="name">칵테일 이름</h2>
      <div class="description">칵테일 설명...</div>
    </div>
  </div>
  <div class='list-container' bind:this={list_element} on:wheel={event => {
      event.preventDefault();
      console.log(event.deltaY);
      event.currentTarget.scrollLeft += event.deltaY;
    }}>
    {#each search_result as recipe (recipe)}
      <div id={recipe.key} class="{recipe.key} recipe-container" on:pointerup={function () {getSelectCocktail(recipe.key)}}>
        <object class="image" type="image/svg+xml" data="" title={recipe.name}></object>
        <div class="name">{recipe.name}</div>
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  $LIST_HEIGHT: 240px;

  .content-box {
    position: relative;
    margin: 0 auto;
    height: calc(100vh - (44px + 48px + 24px + 24px));
    width: calc(100% - 200px);
  }
  
  .detail-container {
    display: flex;
    height: calc(100% - $LIST_HEIGHT);
    width: 100%;
    gap: 24px;

    .detail-img-container {
      border: 2px solid $active-black;
    }

    .name {
      margin: 4px 0 12px 0;
    }

    .description {
      color: $gray;
    }
  }
  
  .list-container {
    display: flex;
    gap: 8px;
    /* min-width: 800px; */
    overflow-x: scroll;
    overflow-y: hidden;
    height: $LIST-HEIGHT;
    width: 100%;
    
    .recipe-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 18px;
      height: 100%;
      cursor: pointer;

      .image {
        // object 요소가 마우스 이벤트를 무시한다.
        pointer-events: none;
        scale: 70%;
        translate: 0 15%;
        opacity: 0.5;
      }

      .name {
        color: $bright-black;
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
        width: 100px;
        height: 3em;
        text-wrap: nowrap;
        margin-top: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &:hover {
        .image {
          opacity: 1;
          translate: 0 calc(15% - 12px);
        }

        .name {
          color: $white;
        }
      }
      
      &.select {
        .image {
          opacity: 1;
          translate: 0 calc(15% - 12px);
        }
  
        .name {
          color: $white;
        }
      }
    }
  }
</style>