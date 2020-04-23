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
                        :page-sizes="[9]"
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
  name: 'vAcconutCard',
  props: ['pagination', 'pageSize', 'currentPager', 'total', 'isCard'],
  methods: {
    handleSizeChange (val) {
      let self = this
      self.$emit('loadData', { pageSize: val })
    },
    handleCurrentChange (val) {
      let self = this
      self.$emit('loadData', {'currentPager': val})
    }
  }
}
</script>

<style lang="scss"  scoped>
    .sys-table {
        margin: 0 20px;
    }
    .sys-table .sys-table-pagination{
        margin-top: 10px;
        text-align: left;
    }
</style>
