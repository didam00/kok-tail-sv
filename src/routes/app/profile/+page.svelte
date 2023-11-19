<script lang="ts">

</script>

<div class="root-container">
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

<style lang="scss">
  .root-container {
    display: flex;
    flex-direction: column;
    padding: 80px 0 0 0;
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

      img {
        height: 100%;
      }

      margin-bottom: 24px;
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