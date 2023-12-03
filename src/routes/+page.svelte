<script lang="ts">
  import { text } from '@sveltejs/kit';
  import { onMount } from 'svelte';

  const test = async function () {
    const t = await fetch(`./api/testAPI`, {
      method: "GET"
    }).then(res => res.json());

    return t;
  };

  onMount(async function () {
    console.log((await test()).nickname);
  })
</script>

<div class="title">
  <h1 class="text">
    Koktail
  </h1>
  <a class="open-app" href="./app/fridge"><span>open</span><span class="material-icons">&#xE89E;</a>
</div>

<style lang="scss">

  :root {
    background: $background-black;
  }

  .title {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
    .text {
      margin: 0;
      
      font-family: 'Pretendard';
      font-weight: 900;
      font-size: 82px;
      color: $white;
    }
    
    .open-app {
      text-align: center;
      color: $white;
      background: $point-pink;
      width: 85px;
      padding: 8px 10px;
      font-weight: 600;
      text-decoration: none;
      font-size: 16px;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;

      &:hover {
        width: 90px;
        background: $bright-point-pink;
      }
    }
  }
</style>