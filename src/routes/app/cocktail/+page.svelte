<script lang="ts">
  import search_icon from "$lib/images/search-icon.svg";
  import { onMount } from "svelte";
  import { recipe_data } from "../../data/recipes";

  const recipes: {
    name: string,
    key: string,
    svg: Document,
    color: string[],
  }[] = [];

  onMount(async() => {
    for (const recipe of recipe_data) {
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

    updateGlasses();
  })

  function updateGlasses(): void {
    for (const recipe of recipes) {
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
</script>

<label class="search-area">
  <input type="text" class="area">
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
</label>

<div class='list-container'>
  {#each recipe_data as recipe (recipe)}
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
    
    .recipe-container {
      position: relative;
      height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 0px 18px;
      transition: none;
      
      &:hover {
        .name {
          color: $white;
        }

        .image {
          transform: scale(80%) translateY(calc(10% - 16px));
        }

        .shadow {
          transform: translate(-50%, 12px);
          background: #080808;
        }
      }

      &:last-child {
        margin-bottom: 24px;
      }
      
      .image {
        transform: scale(80%) translateY(10%);
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
    }
  }
</style>