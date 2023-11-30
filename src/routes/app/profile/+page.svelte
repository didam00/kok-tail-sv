<script lang="ts">
  import setting_icon from "$lib/images/menu.svg";
  import { onMount } from "svelte";

  export let data;
  console.log(data);
  
  // import LoginWindow from "$lib/LoginWindow.svelte";
  // import RegisterWindow from "$lib/RegisterWindow.svelte";

  // let showLoginWin = false;
  // let showRegisterWin = false;
  let showMenubar = false;

  let url: string;

  onMount(() => {
    url = window.location.href;
  })
</script>

<div class="root-container">
  <div class="more-container">
    <button on:click={() => {showMenubar = !showMenubar}}>
      <img src={setting_icon} alt="more">
    </button>
    <div class="more-li-container {showMenubar ? '' : 'hide'}">
      <ul>
        <li class="settings"><button>설정</button></li>
        {#if data.users.user}
        <li class="logout"><a href="../logout?url={url}">로그아웃</a></li>
        {:else}
        <li class="login"><a href="../login?url={url}">로그인</a></li>
        {/if}
      </ul>
    </div>
  </div>
  
  <section class="profile">
    <div class="profile-image-container">
      <img src="/images/basic-profile-image.png" alt="프로필 이미지">
    </div>
    <div class="name">{data.users.user ? data.users.nickname : "로그인해주세요"}</div>
    <div class="description">사용자가 지정한 설명 및 자기소개</div>
  </section>
  <section class="custom-cocktails">
    <h3 class="title">제작한 칵테일</h3>
    <div class="cocktails-container"></div>
  </section>
</div>

<!-- <LoginWindow bind:active={showLoginWin}/> -->
<!-- <RegisterWindow bind:active={showRegisterWin}/> -->

<style lang="scss">
  @import './+page.scss';
</style>