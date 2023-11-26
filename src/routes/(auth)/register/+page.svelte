<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { ActionData } from './$types';
  // import { post } from '../api/register';

  export let form: ActionData;

  let id: string = '';
  let password: string = '';
  let nickname: string = '';
  let email: string = '';
  
  let id_valid: boolean = false;
  let password_valid: boolean = false;
  let nickname_valid: boolean = false;
  let email_valid: boolean = false;

  const params = new URLSearchParams(window.location.search);
  const fromurl: string = params.get("url") ?? "./app";

  // async function handleSubmit() {
  //   const response = await fetch('http://localhost:5174/api/register', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type' : 'application/json'
  //     },
  //     body: JSON.stringify({
  //       id, password, nickname, email
  //     })
  //   });

  //   const { success } = await response.json();

  //   if (success) {
  //   } else {
  //     console.error("회원가입에 실패하였습니다.")
  //   }
  // }

  $: {
    id_valid = id.match(/^[A-Za-z0-9_\-]{6,12}$/) !== null;
  }
  $: {
    password_valid = password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{10,64}$/) !== null;
  }
  $: {
    nickname_valid = nickname.match(/^[ㄱ-ㅎ가-힣A-Za-z0-9_\-]{2,20}$/) !== null;
  }
  $: {
    email_valid = email.match(/^[A-Za-z0-9_\-]+\@[A-Za-z0-9_\-]+\.[A-Za-z]+$/) !== null;
  }
</script>

<div class="center-window register-container">
  <a class="material-icons close-icon" href={fromurl}>&#xe5cd;</a>
  <!-- <h2 class="title">로그인</h2> -->
  <form 
    class="register-form"
    action="?/register"
    method="post"
    use:enhance
  >
    <div class="inputs">
      <input
        name="nickname"
        bind:value={nickname}
        class="nickname" type="text" placeholder="당신의 호칭을 정해주세요."
        required
        minlength="2"
        maxlength="20"
        pattern="^[ㄱ-ㅎ가-힣A-Za-z0-9_\-]+$"
      >
      <input
        name="email"
        bind:value={email}
        class="email" type="email" placeholder="이메일 주소를 입력해주세요."
        required
      >
      {#if form?.dup_email}
        <p class="register-warning"><span class="material-icons">&#xE645;</span>해당 이메일로 가입된 정보가 존재합니다.</p>
      {/if}
      <input
        name="username"
        bind:value={id}
        class="id" type="text" placeholder="아이디를 입력해주세요."
        required
        minlength="6"
        maxlength="12"
        pattern="^[A-Za-z0-9_\-]+$"
      >
      {#if form?.dup_username}
        <p class="register-warning"><span class="material-icons">&#xE645;</span>이미 존재하는 아이디입니다.</p>
      {/if}
      <input
      name="password"
      bind:value={password}
      class="password" type="password" placeholder="비밀번호를 입력해주세요."
      required
      minlength="10"
      maxlength="64"
      pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]+$"
      >
    </div>
    {#if form?.invalid}
      <p class="register-warning"><span class="material-icons">&#xE645;</span>값이 올바르지 않습니다.</p>
    {/if}
    <input
      class="submit" type="submit" value="회원가입"
      disabled={!id_valid || !password_valid || !nickname_valid || !email_valid}
    >
  </form>
  <hr class="form-hr-ar">
  <div class="ask-login">이미 계정이 있으시다면 지금 <a class="go-login" href="./login?url={fromurl}">로그인</a> 해보세요.</div>
</div>
<div class="hide-back"></div>

<style lang="scss">
  :root {
    background: $background-black;
  }

  .register-container {
    display: block;
    width: 400px;
    padding: 32px 60px 48px 60px;

    &.active {
      display: block;
    }
  }

  .close-icon {
    position: absolute;
    right: 12px;
    top: 12px;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
  }

  .register-form {
    display: flex;
    margin-top: 24px;
    flex-direction: column;

    .inputs {
      display: flex;
      flex-direction: column;
      float: left;
      gap: 4px;
      margin-bottom: 24px;
    }

    .nickname, .email, .id, .password {
      padding: 16px 10px;
      border: none;
      background-color: transparent;
      border-bottom: 2px solid $active-black;
      font-size: 1.2em;
      transition: all 150ms;

      &:focus {
        border-color: $bright-black;
      }

      &:valid {
        border-color: $black-point-green;
      }
    }
  }

  .form-hr-ar {
    margin: 24px 0;
    border: 1px solid #101010;
  }

  .ask-login {
    font-size: 0.8em;
    text-align: center;
    margin-top: 24px;
    color: $gray;

    a {
      color: $dark-point-pink;
      cursor: pointer;

      &:hover {
        color: $point-pink;
      }
    }
  }
</style>