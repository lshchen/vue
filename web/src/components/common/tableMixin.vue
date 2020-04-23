<template>
    <div class="sys-table">
        <component :is="isCard === undefined || isCard === true ? 'elCard' : 'div'">
            <slot></slot>
            <div class="sys-table-pagination">
                <template v-if="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPager"
                        :page-sizes="[5, 10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        class="textR">
                    </el-pagination>
                </template>
            </div>
        </component>
    </div>
</template>

<script>
export default {
  name: 'vTableMixin',
  props: ['pagination', 'pageSize', 'currentPager', 'total', 'isCard', 'customType'],
  data () {
    return {
      name: '',
      number: ''
    }
  },
  created () {
    this.name = this.customType ? this.customType : this.$route.name
    this.number = this.getLocalStoreValue(this.name)
    if (this.number) {
      this.$emit('update:pageSize', this.number)
    }
  },
  methods: {
    handleSizeChange (val) {
      if (this.name !== 'code') this.setLocalStoreValue(this.name, val)
      this.$emit('loadData', {'pageSize': val, 'currentPager': 1})
    },
    handleCurrentChange (val) {
      let self = this
      self.$emit('loadData', {'currentPager': val})
    }
  }
}
</script>

<style lang="scss"  scoped>
    .sys-table{
        margin: 0 20px;
    }
    .sys-table .sys-table-pagination{
        margin-top: 10px;
        text-align: left;
    }
</style>