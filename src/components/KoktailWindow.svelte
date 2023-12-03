<script lang="ts">
  import { recipes_data } from "$lib/data/recipes";
  import { tick } from "svelte";

  interface Ingredient {
    id: number,
    keyname: string;
    volume: number;
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

  export let active: boolean = false;
  export let hasIngredients: Ingredient[];
  let recommends: Recipe[] = [];
  
  function showKoktailWin(show?: boolean) {
    if (show === undefined) active = !active;
    else active = show;
  }

  /** recommend cocktail recipe of ingredients user have */
  async function koktail() {
    let recommends_data = [];
    const hasIngredientsKeys = hasIngredients.map(a => a.keyname)

    recommends_data = recipes_data.filter(recipe => {
      // every는 모든 요소가 어떤 걸 다 통과할 수 있는지를 boolean으로 나타낸다.
      return Object.keys(recipe.ingredients).every(ingrdnt => hasIngredientsKeys.includes(ingrdnt));
    })

    for (const rd of recommends_data) {
      const recommend: Recipe = {
        name: rd.name,
        key: rd.key,
        color: rd.color,
        type: 'original',
        author: null,
        description: rd.description,
        ingredients: rd.ingredients,
      }
      
      recommends.push(recommend)
    }
  }

  $: koktail();
</script>

<section class="koktail-window center-window" class:active={active}>
  <h2 class="title">추천 레시피</h2>
  <ul class="recommends">
  {#each recommends as recipe (recipe)}
    <li id={recipe.key} class="{recipe.key} recipe-container">
      <span class="name">{recipe.name}</span>
    </li>
  {/each}
  </ul>
  <div class="button-container">
    <button class="cancle" on:click={() => {showKoktailWin(false);}}>닫기</button>
  </div>
</section>

<div class="hide-back" class:active={active}></div>

<style lang="scss">
  .koktail-window.active {
    display: flex;
    flex-direction: column;
  }

  .koktail-window {
    display: none;
    max-height: calc(100vh - 80px);
    overflow-y: scroll;

    .recommends {
      padding: 0;
      list-style-type: none;

      li {
        margin: 10px 0;

        .name {
          font-size: 1rem;
          font-weight: 600;
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
      font-weight: 900;
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
  }
</style>