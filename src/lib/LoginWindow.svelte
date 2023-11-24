<script lang="ts">
  import { goto } from '$app/navigation';

  let id: string = '';
  let password: string = '';

  let id_valid: boolean = false;
  let password_valid: boolean = false;

  export let active: boolean = false;

  function showWindow(isTrue?: boolean): void {
    if (isTrue === undefined) {
      active = !active;
    } else {
      active = isTrue;
    }
  }

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

  $: {
    id_valid = id.match(/^[A-Za-z0-9_\-]{6,12}$/) !== null;
    // console.log(id_valid)
  }
  $: {
    password_valid = password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{10,32}$/) !== null;
    // console.log(password_valid)
  }
</script>

<div class="center-window login-container {active ? 'active' : ''}">
  <button class="material-icons close-icon" on:click={function () {showWindow(false)}}>&#xe5cd;</button>
  <!-- <h2 class="title">로그인</h2> -->
  <form class="login-form" action="post">
    <div class="inputs">
      <input
        bind:value={id}
        class="id" type="text" placeholder="아이디를 입력해주세요."
        required
        minlength="6"
        maxlength="12"
        pattern="^[A-Za-z0-9_\-]+$"
      >
      <input
        bind:value={password}
        class="psword" type="password" placeholder="비밀번호를 입력해주세요."
        required
        minlength="10"
        maxlength="32"
        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]+$"
      >
    </div>
    <input
      class="submit" type="submit" value="로그인"
      disabled={!id_valid || !password_valid}
    >
  </form>
  <hr class="form-hr-ar">
  <div class="ask-register">계정이 없으시다면 빠르게 <a class="go-register" href="./register">회원가입</a> 하실 수 있어요.</div>
</div>
<div class="hide-back {active ? 'active' : ''}"></div>

<style lang="scss">
  .login-container {
    display: none;
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

    .id, .psword {
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

    .submit {
      font-size: 1em;
      background-color: $point-green;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 800;
      color: $white;
      padding: 12px 0;
      transition: all 120ms;

      &:hover {
        background-color: $dark-point-green;
      }

      &:disabled {
        background-color: $bright-black;
      }
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