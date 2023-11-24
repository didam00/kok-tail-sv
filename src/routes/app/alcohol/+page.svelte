<script lang="ts">
  import arrow_icon from "$lib/images/arrow.svg";
  import search_icon from "$lib/images/search-icon.svg";
  import { alcohols_data } from "$lib/data/alcohols";

  interface Alcohol {
    name: string;
    key: string;
    src: string;
    color: string;
    description: string;
  }

  interface SearchOption {
    key: string;
    value?: string;
    range?: [number, number],
    inlclude?: boolean;
  }

  let search_text: string;
  let search_result: Alcohol[] = [...alcohols_data];
  
  /** Type Guard for key in alcohol */
  function isKeyOfAlcohol(key: string, alcohol: Alcohol): key is keyof Alcohol {
    return key in alcohol;
  }

  function searchAlcohol(options: SearchOption[]) {
    let results: Alcohol[] = [...alcohols_data];

    for (let option of options) {
      if ('value' in option) {
        results = results.filter((alcohol: Alcohol) => {
          if (isKeyOfAlcohol(option.key, alcohol)) {
            /** nullish coalescing 연산자를 이용 */
            return (alcohol[option.key].toLowerCase()).includes((option.value?.toLowerCase()) ?? "");
          }
        });
      }
    }

    search_result = results.sort();
  }
</script>

<label class="search-area">
  <input 
    type="text" 
    bind:value={search_text} 
    class="area" 
    on:input={function () {searchAlcohol([{key: "name", value: this.value}])}} 
    placeholder="검색어를 입력해주세요."
  >
  <input type="image" src={search_icon} alt="search icon" class="search-icon">
</label>
<div class='info-box'>
  {#each search_result as alcohol (alcohol)}
  <div class="{alcohol.key} alchol-container">
    <div class="img-container">
      <img class="alchol-img" src="/images/bottles/{alcohol.src}.svg" alt="">
    </div>
    <div class="detail-container">
      <div class="name">{alcohol.name}</div>
      <div class="description">{alcohol.description}</div>
    </div>
    <img class="arrow-icon" src={arrow_icon} alt="arrow icon">
  </div>
  {/each}
</div>

<div class="alcohol-detail-window">
  
</div>

<style lang='scss'>
  .info-box {
    display: flex;
    flex-direction: column;
    width: calc(100% - 400px);
    height: calc(100vh - (44px + 48px + 24px));
    margin: 0 auto;
    overflow-y: scroll;
    min-width: 800px;
    
    .alchol-container {
      position: relative;
      /* border-bottom: 1px solid $active-black; */
      padding-right: 16px;
      box-sizing: border-box;
      transition: all 150ms;
      display: flex;
      cursor: pointer;
      border-left: 3px solid $active-black;

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
        .name, .description {
          padding: 4px 0;
        }
  
        .name {
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
        top: 50%;
        transform: translateY(-50%);
        height: 24px;
        width: 24px;
        cursor: pointer;
        transition: all 180ms;
        padding: 24px;
        filter: brightness(0.25);
      }
      
      &:hover {
        border-color: $bright-black;
        /* translate: 4px 0; */
        
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
  }
</style>