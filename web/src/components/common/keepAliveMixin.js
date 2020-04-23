function callHook (vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
      }
    }
  }
}

export default {
  activated () {
    if (this.isFirstTime <= 1) {
      this.isFirstTime++
      return
    }
    // 非自己开发组件不能调用该钩子函数
    if (this.$options._componentTag && this.$options._componentTag.indexOf('el-') === 0) {
      return
    }
    if (this.$route.meta.isEdit && this.$store.state.loading.isRefresh) {
      // if (!this.$route.meta.keepAlive) {
      callHook(this, 'created')
      if (this.componentName !== 'TableLoadingMixin') {
        callHook(this, 'mounted')
      }
      this.$nextTick(() => {
        if (this.$store.state.loading.isRefresh) this.$store.commit('loading/setIsRefresh', false)
      })
    }
    // if (this.$store.state.user.isRefresh) this.$store.commit('user/setIsRefresh', false)
    // }
  },
  created () {
    this.isFirstTime++
  },
  mounted () {
    if (this.$options._componentTag === 'el-button') {
      let personData = this.$attrs.contrast ? this.$attrs.contrast : null
      if (this.$attrs.authKey && !this.ifHasAuth(this.$attrs.authKey, personData)) {
        this.$el.style.display = 'none'
      }
    }
  },
  data () {
    return {
      isFirstTime: 0
    }
  }
}
