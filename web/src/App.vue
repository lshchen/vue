<template>
  <div id="app">
    <router-view :key="isRouterAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: 'sale',
  components: {
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  /*@import "assets/css/test";*/
  #app{
    height: 100%;
    position: relative;
    color:#222;
    font-size: 13px;
  }
</style>
