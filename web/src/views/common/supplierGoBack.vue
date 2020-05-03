<template>
  <div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  computed: {

  },
  created () {
    if (this.$route.query.isEdit) this.$store.commit('loading/setIsRefresh', true)
    this.$router.go(-1)
    this.closeTab(this)
  },
  mounted () {

  },
  watch: {

  },
  methods: {
  }
}
</script>
<style lang="scss"  scoped>
</style>