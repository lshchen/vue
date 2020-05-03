<template>
    <div class="wrapper">
        <template>
            <v-header-bar>
                <template slot="topnav">
                    <v-nav-bar></v-nav-bar>
                    <v-tag-nav></v-tag-nav>
                </template>
            </v-header-bar>
        </template>
        <div class="sys-content top">
            <keep-alive :include="nameList">
                <router-view :key="$route.fullPath"></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
// import { Message } from 'element-ui'
import vHeaderBar from './headerBar'
import vNavBar from './navBar'
import vTagNav from './tagNav'
import { mapGetters } from 'vuex'
export default {
  watch: {
    openedPageList (newValue) {
      console.log(newValue)
      this.nameList = newValue.map(item => {
        if (item.isEdit) {
          return item.name
        }
      })
    }
  },
  data () {
    return {
      nameList: [],
      dialogVisible: false,
      isHidden: false,
      startTime: '',
      times: 300,
      citys: [],
      cityId: ''
    }
  },
  components: {
    vHeaderBar,
    vNavBar,
    vTagNav
  },
  computed: {
    ...mapGetters(['openedPageList'])
  },
  created () {
  },
  mounted () {
    console.log(this.nameList)
  },
  beforeDestroy () {
  },
  methods: {
  }
}
</script>
<style  scoped>
  .routerAnimation-leave-active,
  .routerAnimation-enter-active {
    transition: all .2s;
  }
  .routerAnimation-enter {
    opacity: 0;
    transform: translateX(-30px);
  }
  .routerAnimation-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .dropdown{
    position: absolute;
    right:2%;
    bottom:10%;
    z-index:999;
  }
</style>
