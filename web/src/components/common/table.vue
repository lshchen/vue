
<script>
  import Vue from 'vue'
  import { Table, Loading } from 'element-ui'
  Vue.use(Loading)
  let loading = Vue.directive('loading')
  export default {
    mixins: [Table],
    name: 'TableLoadingMixin',
    data: () => {
      return {
        componentName: 'TableLoadingMixin'
      }
    },
    mounted () {
      // Table.mounted.apply(this)
      const timer = setTimeout(() => {
        if (this.$attrs.value !== 'otherLoad') {
          loading.bind(this.$el, {value: this.$store.state.loading.isLoading, modifiers: {}}, this.$vnode)
        }
        Table.props.stripe.default = true
      }, 0)
      this.clearTimer(timer)
    },
    watch: {
      '$store.state.loading.isLoading': function (newVal) {
        if (!this.$el || !this.$el.instance) return
        if (this.$attrs.value !== 'otherLoad') {
          loading.update(this.$el, {value: newVal, modifiers: {}})
        }
      }
    }
  }
</script>