<script lang="ts">
  import setting_icon from "$lib/images/menu.svg";
  import { onMount } from "svelte";
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
        <li class="login"><a href="../login?url={url}">로그인</a></li>
      </ul>
    </div>
  </div>
  
  <section class="profile">
    <div class="profile-image-container">
      <img src="/images/basic-profile-image.png" alt="프로필 이미지">
    </div>
    <div class="name">사용자 이름</div>
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
  .root-container {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 80px 0 0 0;
  }
  
  .more-container {
    position: absolute;
    right: 0;
    top: 60px;
    
    & > button {
      background: none;
      border: 0;
      
      img {
        cursor: pointer;
        width: 34px;
        float: right;
        
        &:hover {
          filter: brightness(0.5);
        }
      }
      
      img.active {
        background: red;
      }
    }

    .more-li-container ul {
      position: absolute;
      list-style-type: none;
      border: 1px solid $bright-black;
      border-radius: 4px;
      padding: 0;
      top: 28px;
      right: 0;
      color: $white;
      opacity: 1;
      display: flex;
      flex-direction: column;

      li {
        width: 130px;
        
        button, a {
          display: block;
          text-decoration: none;
          cursor: pointer;
          padding: 10px 16px;
          text-align: center;
          background: none;
          border: none;
          font-size: 1em;
          width: calc(100% - 32px);
          height: 100%;
          box-sizing: content-box;
        }

        &:hover {
          background: $active-black;
        }
      }
    }
  }

  .profile {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid $active-black;
    padding-bottom: 32px;
    text-align: center;

    .profile-image-container {
      margin: 0 auto;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      border: 1px solid $active-black;
      overflow: hidden;
      margin-bottom: 24px;

      img {
        height: 100%;
      }
    }

    .name {
      color: $white;
      font-size: 1.5em;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .description {
      color: $gray;
      font-size: 1em;
    }
  }

  .custom-cocktails {
    .cocktails-container {
      width: 100%;
      height: 160px;
    }
  }
</style>