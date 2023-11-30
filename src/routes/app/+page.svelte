<script lang="ts">
  import add_bottle_icon from '$lib/images/add_bottle_icon.svg';
  import up_icon from '$lib/images/up_icon.svg';
  import down_icon from '$lib/images/down_icon.svg';

  import MaterialWindow from '$lib/MaterialWindow.svelte';
  import { ingredients_data } from '$lib/data/ingredients';
    
  interface Ingredient {
    id: number,
    keyname: string;
    volume: number;
  }

  export let data;

  let hasIngredients: Ingredient[] = data.ingredients;
  let volumeIsChange = false;
  let showAddMaterialWin = false;

  // 좌클릭하면 해당 요소가 어두워지고 가운데에 잔량 표시
  // 스크롤하여 잔량을 조절 가능
  // 모바일에서는 드래그 위/아래로 추가/제거
  // 우측 상단 삭제 버튼으로 삭제 가능

  function focusingredient(ingredient_key: string) {
    const ingredient = document.querySelector(`.${ingredient_key}`) as HTMLElement;
    ingredient.classList.add('focused');
  }

  async function unfocusingredient(ingredient_key: string) {
    const ingrdntElement = document.querySelector(`.${ingredient_key}`) as HTMLElement;
    ingrdntElement.classList.remove('focused');
    
    // 언포커싱했을 때 데이터베이스에 업데이트한다.
    if (volumeIsChange) {
      const ingredient = hasIngredients.find(a => a.keyname == ingredient_key);

      if (!ingredient) {
        console.error("Can't found ingredient key:", ingredient_key);
        return;
      }

      if (ingredient.volume <= 0) {
        const response = await fetch('/api/updateIngredient', {
          method: 'DELETE',
          body: JSON.stringify({
            data: ingredient,
          })
        });

        const ingrdntIdx = hasIngredients.indexOf(ingredient);
        hasIngredients = [
          ...hasIngredients.slice(0, ingrdntIdx), 
          ...hasIngredients.slice(ingrdntIdx+1)];
        return response;

      } else {
        const response = await fetch('/api/updateIngredient', {
          method: 'PATCH',
          body: JSON.stringify({
            data: ingredient,
          })
        });
        return response;
      }

    }

    volumeIsChange = false;
  }

  async function updateDBaddIngrdnts(ingredients: Ingredient[]) {
    const response = await fetch('/api/updateIngredient', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      body: JSON.stringify({
        data: ingredients,
      })
    });

    if (response.ok) {
      console.log("Successfully insert ingredients data into database.");
    } else {
      console.log(response);
    }
  }

  async function applyAddingredients(checksElements: HTMLInputElement[]) {
    const SLICELEN = 'material-list-'.length;
    const keys = checksElements.map(ele => ele.id.slice(SLICELEN));
    let newIngredients = [];

    for (let key of keys) {
      let ingredient = ingredients_data.find(o => o.key == key);

      if (!ingredient) {
        console.error("다음 키가 ingredients 데이터에 없습니다:"+key);
        continue;
      }

      let newIngredient: Ingredient = {
        keyname: ingredient.key,
        volume: 100,
      }

      newIngredients.push(newIngredient);
      hasIngredients = [...hasIngredients, newIngredient];
    }

    updateDBaddIngrdnts(newIngredients);
  }
</script>

<div class="koktail-button">kok-tail!</div>

<div class="ingredients-frame">
  {#each hasIngredients as ingredient (ingredient)}
    <div class="ingredient-container {ingredient.keyname}"
      on:pointerdown={() => focusingredient(ingredient.keyname)}
      on:pointerleave={() => unfocusingredient(ingredient.keyname)}
    >
      <img
        class="{ingredient.keyname} ingredients"
        alt={ingredients_data.find(a => a.key == ingredient.keyname)?.name}
        src={`/images/ingredients/${ingredients_data.find(a => a.key == ingredient.keyname)?.src}.svg`}
      />

      <div class="focus-ml" on:wheel={
        (event) => {
          const val = event.deltaY;
          const unit = event.shiftKey ? 1 : 10;
          if (val > 0) {
            ingredient.volume -= unit;
            volumeIsChange = true;
          } else {
            ingredient.volume += unit;
            volumeIsChange = true;
          }
          if (ingredient.volume < 0) {
            ingredient.volume = 0;
          }
        }
      } class:empty={ingredient.volume <= 0}>
        <img src={up_icon} alt="up icon">
        <span class="ml">{ingredient.volume}mL</span>
        <img src={down_icon} alt="down icon">
      </div>

      <div class="caption">
        <span class="name">{ingredients_data.find(a => a.key == ingredient.keyname)?.name}</span>
        <span class="ml">{ingredient.volume}mL</span>
        <input type="checkbox" name={ingredient.keyname} class="select-ingredients">
      </div>
    </div>
  {/each}

  <button class="add-ingredient-container" on:click={() => {showAddMaterialWin = true}}>
    <img class="add-ingredient" src={add_bottle_icon} alt="add ingredient icon">
  </button>

</div>

<MaterialWindow callback={applyAddingredients} bind:active={showAddMaterialWin}/>

<style lang="scss">
  @import './+page.scss';
</style>