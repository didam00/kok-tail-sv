<script lang="ts">
  import arrow_icon from "$lib/images/arrow.svg";
  import search_icon from "$lib/images/search-icon.svg";
  import { ingredients_data } from "$lib/data/ingredients";
  import { recipes_data } from "$lib/data/recipes";

  interface Ingredient {
    name: string;
    key: string;
    src: string;
    color: string;
    description: string;
    recipes?: {key: string, name: string}[];
  }

  interface SearchOption {
    key: string;
    value?: string;
    range?: [number, number],
    inlclude?: boolean;
  }

  let search_text: string;
  let search_result: Ingredient[] = [...ingredients_data];
  
  /** Type Guard for key in ingredient */
  function isKeyOfingredient(key: string, ingredient: Ingredient): key is keyof Ingredient {
    return key in ingredient;
  }

  function searchingredient(options: SearchOption[]) {
    let results: Ingredient[] = [...ingredients_data];

    for (let option of options) {
      if ('value' in option) {
        results = results.filter((ingredient: Ingredient) => {
          if (isKeyOfingredient(option.key, ingredient)) {
            if (typeof ingredient[option.key] === "string") {
              /** nullish coalescing 연산자를 이용 */
              return ((ingredient[option.key] as string).toLowerCase().replace(" ", "")).includes((option.value?.toLowerCase().replace(" ", "")) ?? "");
            }
          }
        });
      }
    }

    search_result = results.sort();
  }

  function getMoreInformation(ingredient: Ingredient) {
    const li = document.querySelector(`.${ingredient.key}`)!;
    li.classList.toggle("active");

    if (li.classList.contains('active')) {
      const recipes = recipes_data.filter(recipe => ingredient.key in recipe.ingredients);
      li.querySelector('.recipes-container ul')!.innerHTML = "";

      for (const recipe of recipes) {
        const recipe_li = document.createElement('li');
        recipe_li.id = recipe.key;
        recipe_li.innerText = recipe.name;
        li.querySelector('.recipes-container ul')?.appendChild(recipe_li);
      }
    }
  }
</script>

<label class="search-area">
  <input 
    type="text" 
    bind:value={search_text} 
    class="area" 
    on:input={function () {searchingredient([{key: "name", value: this.value}])}} 
    placeholder="검색어를 입력해주세요."
  >
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
</label>
<ul class='info-box'>
  {#each search_result as ingredient (ingredient)}
  <li class="{ingredient.key} alchol-container" on:pointerdown = {function () {getMoreInformation(ingredient)}}>
    <div class="img-container">
      <img class="alchol-img" src="/images/ingredients/{ingredient.src}.svg" alt="">
    </div>
    <div class="detail-container">
      <div class="name">{ingredient.name}</div>
      <div class="description">{ingredient.description}</div>
      <div class="more-information">
        <div class="recipes-container">
          <h3 class="title">만들 수 있는 레시피</h3>
          <ul>

          </ul>
        </div>
      </div>
    </div>
    <img class="arrow-icon" src={arrow_icon} alt="arrow icon">
  </li>
  {/each}
</ul>

<style lang='scss'>
  @keyframes turningAnimation {
    0% {
      transform: rotateY(0deg);
      filter: brightness(100%);
    }
    25% {
      filter: brightness(100%);
    }
    50% {
      filter: brightness(230%) drop-shadow(0 0 14px #ffffff40);
    }
    75% {
      filter: brightness(100%);
    } 
    100% {
      transform: rotateY(360deg);
      filter: brightness(100%);
    }
  }

  .info-box {
    width: calc(100% - 400px);
    height: calc(100vh - (44px + 48px + 24px));
    margin: 0 auto;
    padding: 0;
    overflow-y: scroll;
  }

  .alchol-container {
    position: relative;
    /* border-bottom: 1px solid $active-black; */
    padding-right: 16px;
    box-sizing: border-box;
    transition: all 150ms;
    display: flex;
    cursor: pointer;
    border-left: 2px solid transparent;
    height: 140px;

    &:last-child {
      border-bottom: none;
    }

    .img-container {
      position: relative;
      height: 140px;
      width: 140px;

      img {
        position: absolute;
        scale: 0.5;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        max-height: 200px;
      }
    }

    .detail-container {
      width: calc(100% - 220px);

      .name, .description {
        padding: 4px 0;
      }

      .name {
        text-align: left;
        margin-top: 28px;
        font-weight: 700;
        color: $gray;
        /* color: $white; */
        font-size: 1em;
      }
      
      .description {
        margin-bottom: 32px;
        color: $bright-black;
        /* color: $gray; */
        font-size: 1em;
      }
    }

    .arrow-icon {
      position: absolute;
      right: 16px;
      top: (70px - 12px - 12px);
      height: 24px;
      width: 24px;
      cursor: pointer;
      transition: all 180ms;
      padding: 24px;
      filter: brightness(0.25);
    }

    .more-information {
      /* display: none; */
      opacity: 0;
    }
    
    .more-information .recipes-container {
      .title {
        font-size: 1rem;
        font-weight: 800;
        margin-bottom: 8px;
      }

      ul {
        list-style-type: disc;
        padding-left: 14px;
        color: $gray;
        overflow-y: auto;
      }
    }
    
    &:hover {
      /* translate: 0 -8px; */
      /* box-shadow: 0px 8px 24px $active-black; */

      border-color: $gray;
      translate: 4px 0;
      
      .detail-container .name {
        color: $white;
      }
      
      .detail-container .description {
        color: $gray;
      }
      
      .arrow-icon {
        filter: brightness(0.5);
      }
    }
  }

  .alchol-container.active {
    height: 300px;

    .img-container {
      height: 100%;
      width: 200px;
      
      img {
        rotate: 15deg;
        scale: 0.7;
        animation: turningAnimation 2s linear infinite;
      }
    }

    .name {
      font-size: 1.4em;
      font-weight: 800;
      color: $white;
    }
    
    .description {
      color: $gray;
    }

    .arrow-icon {
      rotate: 90deg;
    }

    .more-information {
      /* display: block; */
      opacity: 1;
    }
  }
</style>