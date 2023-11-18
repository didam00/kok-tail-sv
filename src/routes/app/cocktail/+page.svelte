<script lang="ts">
  import search_icon from "$lib/images/search-icon.svg";
  import { onMount, tick } from "svelte";
  import { recipes_data } from "../../data/recipes";

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

  let search_text: string;
  let search_result: Recipe[] = [];

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
      recipes.push(r)
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

  $: updateGlasses(), search_result;
</script>

<label class="search-area">
  <input bind:value={search_text} type="text" class="area" on:input={function () {searchRecipe([{key: "name", value: this.value}])}}>
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
</label>

<div class='list-container'>
  {#each search_result as recipe (recipe)}
    <div class="{recipe.key} recipe-container">
      <object class="image" type="image/svg+xml" data="" title={recipe.name}></object>
      <div class="name">{recipe.name}</div>
      <!-- <div class="shadow"></div> -->
    </div>
  {/each}
</div>

<style lang="scss">
  .list-container {
    display: flex;
    margin: 0 auto;
    overflow-y: scroll;
    height: calc(100vh - (44px + 48px + 24px));
    width: calc(100% - 400px);
    flex-wrap: wrap;
    row-gap: 0px;
    justify-content: space-around;
    min-width: 800px;
    
    .recipe-container {
      position: relative;
      height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      border-radius: 4px;
      box-sizing: border-box;
      /* padding: 0px 6px; */
      transition: none;

      &:last-child {
        margin-bottom: 24px;
      }
      
      .image {
        transform: scale(60%) translateY(30%);
      }

      .name {
        color: $bright-black;
        font-size: 16px;
        text-align: center;
        margin-top: 4px;
        padding: 8px;
      }

      .shadow {
        position: absolute;
        height: 26px;
        width: 60%;
        background: #080808;
        border-radius: 50%;
        left: 50%;
        transform: translateX(-50%);
        
        z-index: -1;
      }
      
      &:hover {
        .name {
          color: $white;
        }

        .image {
          transform: scale(60%) translateY(calc(20% - 16px));
        }

        .shadow {
          transform: translate(-50%, 12px);
          background: #080808;
        }
      }
    }
  }
</style>