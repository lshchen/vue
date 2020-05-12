<template>
    <el-submenu v-if="item.subList && item.subList.length" :index="navIndex">
        <!-- 创建父级菜单 -->
        <template slot="title">
<!--            <div class="icon fa" :class="'iconfont ' + item.icon"></div>-->
            {{ item.name }}
        </template>
        <!-- 创建子菜单 -->
        <nav-bar-item v-for="(subItem,i) in item.subList" :key="navIndex+'-'+i" :navIndex="navIndex+'-'+i" :item="subItem" ></nav-bar-item>
    </el-submenu>

    <el-menu-item v-else :index="nonull(navIndex)" :route="{path: item.path}">
<!--        <div class="icon fa" :class="'iconfont ' + item.icon"></div>-->
        {{ item.name }}
    </el-menu-item>
</template>

<script>
export default {
  name: 'navBarItem',
  props: ['item', 'navIndex'],
  methods: {
    nonull (e) {
      return e ? String(e) : ''
    }
  },
  mounted () {
    console.log(this.item)
  }
}
</script>
<style lang="scss"  scoped>
.fa{
    font-size: 16px;
}
</style>
