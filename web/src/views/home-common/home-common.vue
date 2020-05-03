<template>
  <div class="home_empty">
    <span class="welcome">欢迎登录销售系统</span>
  </div>
</template>

<script>
export default {
  name: 'home-common',
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  .home_empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
      .welcome {
        font-size: 45px;
        white-space: nowrap;
        letter-spacing: 0.5em;
        font-weight: 600;
      }
  }
</style>
