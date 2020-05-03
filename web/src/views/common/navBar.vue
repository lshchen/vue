<template>
    <div class="side-nav top">
        <el-menu router ref="navbar" :default-active="defActive" mode="horizontal" menu-trigger="hover"
                 active-text-color="#fff" background-color="#4169ad" text-color="#fff" @select="selectMenu" @open="openMenu" @close="closeMenu" unique-opened>
            <!-- <el-menu-item index="1" route="/main/strike/list">首页</el-menu-item> -->
            <nav-bar-item v-for="(item, n) in navList" :item="item" :navIndex="nonull(n)" :key="n"></nav-bar-item>
        </el-menu>
        <div v-show="navBgShow" class="full-screen-navBg" @click.self="closeAll"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import navBarItem from './navBarItem'

export default {
  data () {
    return {
      navBgShow: false
    }
  },
  computed: {
    ...mapGetters(['navList']),
    defActive () {
      return this.$route.path
    }
  },
  watch: {
    // 当通过TagNav来激活页面时也执行一次selectMenu
    $route () {
      // let path = this.$route.path
      // let indexPath = this.$refs.navbar.items[path].indexPath
      // this.selectMenu(path, indexPath)
    }
  },
  mounted () {
    console.log(this.navList)
  },
  created () {
  },
  methods: {
    selectMenu (index, indexPath) {
      const openedMenus = this.$refs.navbar.openedMenus
      let openMenuList
      // 如果点击的是二级菜单，则获取其后已经打开的菜单
      if (indexPath.length > 1) {
        const parentPath = indexPath[indexPath.length - 2]
        openMenuList = openedMenus.slice(openedMenus.indexOf(parentPath) + 1)
      } else {
        openMenuList = openedMenus
      }
      // 关闭菜单
      openMenuList.forEach((ele) => {
        this.$refs.navbar.closeMenu(ele)
      })
      this.navBgShow = false
    },
    openMenu () {
      this.navBgShow = true
    },
    closeMenu () {
      this.navBgShow = false
    },
    closeAll () {
      const openMenu = this.$refs.navbar.openedMenus.concat([])
      openMenu.forEach((ele) => {
        this.$refs.navbar.closeMenu(ele)
      })
      this.navBgShow = false
    },
    nonull (e) {
      return e ? String(e) : ''
    }
  },
  components: { navBarItem }
}
</script>
