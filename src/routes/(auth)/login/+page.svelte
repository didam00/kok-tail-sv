<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let id: string = '';
  let password: string = '';

  let id_valid: boolean = false;
  let password_valid: boolean = false;
  let seePassword: boolean = false;

  const params = new URLSearchParams(window.location.search);
  const fromurl: string = params.get("url") ?? "./app";

  async function handleSubmit() {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password })
    });

    const { success } = await response.json();
    if (success) {
      goto('/protected');
    } else {
      alert('Invalid id or password');
    }
  }

  function togglePassword() {
    seePassword = !seePassword;
    document.querySelector(".password")?.setAttribute("type", seePassword ? "text" : "password");
    (document.querySelector(".see-password") as HTMLSpanElement).innerHTML = seePassword ? "&#xE8F4;" : "&#xE8F5;";
  }

  $: {
    id_valid = id.match(/^[A-Za-z0-9_\-]{6,12}$/) !== null;
    // console.log(id_valid)
  }
  $: {
    password_valid = password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{10,32}$/) !== null;
    // console.log(password_valid)
  }
</script>

<div class="center-window login-container">
  <a class="material-icons close-icon" href={fromurl}>&#xe5cd;</a>
  <form 
    class="login-form"
    action="?/login"
    method="post"
    use:enhance
  >
    <div class="inputs">
      <div class="id-container">
        <input
          name="username"
          bind:value={id}
          class="id" type="text" placeholder="아이디를 입력해주세요."
          required
          minlength="6"
          maxlength="12"
          pattern="^[A-Za-z0-9_\-]+$"
        >
      </div>
      {#if form?.cantFindUsername}
        <p class="register-warning"><span class="material-icons">&#xE645;</span>해당하는 아이디를 찾을 수 없습니다.</p>
      {/if}
      <div class="password-container">
        <input
          name="password"
          bind:value={password}
          class="password" type="password" placeholder="비밀번호를 입력해주세요."
          required
          minlength="10"
          maxlength="32"
          pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]+$"
        >
        <span class="material-icons see-password" on:pointerdown={togglePassword}>&#xE8F5;</span>
      </div>
      {#if form?.incorrectPassword}
        <p class="register-warning"><span class="material-icons">&#xE645;</span>비밀번호가 일치하지 않습니다.</p>
      {/if}
    </div>
    <input
      class="submit" type="submit" value="로그인"
      disabled={!id_valid || !password_valid}
    >
  </form>
  <hr class="form-hr-ar">
  <div class="ask-register">계정이 없으시다면 빠르게 <a class="go-register" href="./register?url={fromurl}">회원가입</a> 하실 수 있어요.</div>
</div>
<div class="hide-back"></div>

<style lang="scss">
  :root {
    background: $background-black;
  }

  .login-container {
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

  .login-form {
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

    .id-container, .password-container {
      position: relative;
    }

    .id, .password {
      padding: 16px 10px;
      border: none;
      background-color: transparent;
      border-bottom: 2px solid $active-black;
      font-size: 1.2em;
      transition: all 150ms;
      width: calc(100% - 20px);

      &:focus {
        border-color: $bright-black;
      }

      &:valid {
        border-color: $black-point-green;
      }
    }

    .password-container .see-password {
      position: absolute;
      right: 12px;
      top: 50%;
      translate: 0 -50%;
      cursor: pointer;
      color: $active-black;

      &:hover {
        color: $bright-black;
      }

    }

    .submit {
      /*  */
    }
  }

  .form-hr-ar {
    margin: 24px 0;
    border: 1px solid #101010;
  }

  .ask-register {
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