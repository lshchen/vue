<template>
    <div class="tag-nav">
      <scroll-bar ref="scrollBar" :pagelist="openedPageList">
          <router-link ref="tag" class="tag-nav-item" :class="isActive(item) && index != 0 ? 'cur' : index != 0 ? 'mid': ''" v-for="(item, index) in openedPageList"
          :to="item.fullPath" :key="index" :value="item" v-contextmenu:contextmenu>
            <span>{{item.title}}</span>
            <transition name=".el-fade-in-linear">
              <span  class='el-icon-close'  v-if="index != 0"  @click.prevent.stop="closeTheTag(item, index)"></span>
            </transition>
          </router-link>
      </scroll-bar>
      <v-contextmenu ref="contextmenu" @contextmenu="handleContextMenu">
        <v-contextmenu-item @click="feash">刷新</v-contextmenu-item>
        <v-contextmenu-item v-if="closeShow"  @click="close">关闭</v-contextmenu-item>
        <v-contextmenu-item @click="closeLeft">关闭左边</v-contextmenu-item>
        <v-contextmenu-item @click="closeRight">关闭右边</v-contextmenu-item>
        <v-contextmenu-item @click="closeOther">关闭其他</v-contextmenu-item>
        <v-contextmenu-item @click="closeAll">关闭所有</v-contextmenu-item>
      </v-contextmenu>
    </div>
</template>

<script>
import ScrollBar from './scrollBar'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      rightClickData: {},
      closeShow: true
    }
  },
  computed: {
    ...mapGetters(['openedPageList'])
  },
  mounted () {
    // 首次加载时将默认页面加入缓存
    this.addTagNav()
  },
  watch: {
    $route () {
      this.addTagNav()
      this.scrollToCurTag()
    }
  },
  methods: {
    handleContextMenu (ref) {
      // 可以获取绑定contextmenu 的ele
      this.rightClickData.fullPath = ref.elm.hash.indexOf('#') !== -1 ? ref.elm.hash.split('#')[1] : ref.elm.hash
      if (ref.data.attrs.value.title === '主页') {
        this.closeShow = false
      } else {
        this.closeShow = true
      }
    },
    feash (vm, event) {
      if (this.$route.fullPath === this.rightClickData.fullPath) {
        this.$router.push({path: '/main/common/supplierGoBack',
          query: {
            isEdit: this.$route.meta.isEdit
          }
        })
      } else {
        this.$router.push(this.rightClickData.fullPath)
      }
      this.$store.commit('user/setChangePwd', true)
    },
    close (vm, event) {
      this.openedPageList.forEach((item, index) => {
        if (item.fullPath === this.rightClickData.fullPath) {
          this.$store.commit('tagNav/removeTagNav', item)
          if (this.$route.fullPath === this.rightClickData.fullPath) {
            this.$router.push(this.openedPageList[index - 1].fullPath)
          }
          let self = this
          let data = self.getCache()
          data.forEach((obj, index) => {
            if (obj.key === item.fullPath) {
              self.delCache(item.fullPath)
            }
          })
        }
      })
    },
    closeLeft (vm, event) {
      let pathNumber = 0
      for (let [index, item] of this.openedPageList.entries()) {
        if (item.fullPath !== this.rightClickData.fullPath) {
          if (item.title !== '主页') {
            pathNumber += 1
            if (this.$route.fullPath === item.fullPath) {
              this.$router.push(this.openedPageList[index + 1].fullPath)
            }
            let self = this
            let data = self.getCache()
            data.forEach((obj, index) => {
              if (obj.key === item.fullPath) {
                self.delCache(item.fullPath)
              }
            })
          }
        } else {
          this.$store.commit('tagNav/removeTagLeft', pathNumber)
          break
        }
      }
    },
    closeRight (vm, event) {
      for (let [index, item] of this.openedPageList.entries()) {
        if (item.fullPath === this.rightClickData.fullPath) {
          for (let [i, object] of this.openedPageList.entries()) {
            if (i > index) {
              let self = this
              let data = self.getCache()
              data.forEach((obj, num) => {
                if (obj.key === object.fullPath) {
                  self.delCache(obj.key)
                }
              })
            }
          }
          this.$store.commit('tagNav/removeTagRight', index)
          this.$router.push(this.openedPageList[index].fullPath)
        }
      }
    },
    closeOther (vm, event) {
      let datas = this.openedPageList.entries()
      for (let [i, v] of datas) {
        if (v.fullPath === this.rightClickData.fullPath) {
          this.$store.commit('tagNav/removeTagOther', i)
        }
      }
      this.delOther(this.rightClickData.fullPath)
      this.$router.push(this.rightClickData.fullPath)
    },
    closeAll (vm, event) {
      this.$store.commit('tagNav/removeTagAll')
      this.delAll()
      this.$router.push(this.openedPageList[0].fullPath)
    },
    addTagNav () {
      let paramText = ''
      let paramJson = this.$route.params
      let queryJson = this.$route.query
      if (queryJson.showTagName) {
        paramText = '-' + queryJson.showTagName
      } else if (paramJson && Object.keys(paramJson).length > 0) {
        if (!(paramJson[Object.keys(paramJson)[0]] instanceof Object)) {
          paramText = '-' + paramJson[Object.keys(paramJson)[0]]
        }
      }
      // 如果需要缓存则必须使用组件自身的name，而不是router的name
      this.$store.commit('tagNav/addTagNav', {
        // name: this.$router.getMatchedComponents()[1].name,
        fullPath: this.$route.fullPath,
        title: this.$route.name + paramText,
        isEdit: this.$route.meta.isEdit,
        name: this.$route.meta.componentsName
      })
    },
    isActive (item) {
      return item.fullPath === this.$route.fullPath
    },
    closeTheTag (item, index) {
      // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
      // 如果没有前一个Tag，则加载默认页面
      this.$store.commit('tagNav/removeTagNav', item)
      if (this.$route.fullPath === item.fullPath) {
        this.$router.push(this.openedPageList[index - 1].fullPath)
      }
      let self = this
      let data = self.getCache()
      data.forEach((obj, index) => {
        if (obj.key === item.fullPath) {
          self.delCache(obj.key)
        }
      })
    },
    scrollToCurTag () {
      this.$nextTick(() => {
        for (let item of this.$refs.tag) {
          if (item.to === this.$route.path) {
            this.$refs.scrollBar.scrollToCurTag(item.$el)
            break
          }
        }
      })
    }
  },
  components: {ScrollBar}
}
</script>
<style lang="scss"  scoped>
  .show{
    display:none;
  }
  .scroll-wrap{
    float: left;
    width: 96%;
  }
  .tag-nav{
    background: #eee;
    box-shadow: none;
    padding: 0 20px 0 20px;
  }
  .tag-nav .tag-nav-item{
    margin-right: 0px;
    padding: 0 20px;
    background-color: #f0f0f0;
    height: 30px;
    line-height: 30px;
    border-radius: 0px;
    border-top: 1px solid #cfd7e5;
    border-left: 1px solid #cfd7e5;
    border-right: 1px solid #cfd7e5;
  }
  .tag-nav .tag-nav-item{
    color: #465873;
    height: 30px;
    line-height: 30px;
    border-left-color: #cfd7e5;
  }
  .mid:hover{
    //padding: 0 12.34px;
    .el-icon-close{
      //display: inline-block;
      opacity: 1;
    }
  }
  .el-icon-close:hover{
    background:rgba(96,96,96,0.4);
  }
  .mid{
    padding: 0 8px 0 20px!important;
    .el-icon-close{
      transition: all .5s ease;
      //display: none; 
      opacity: 0;
    }
  }
  .cur{
    padding: 0 8px 0 20px!important;
  }
  .el-icon-close{
    transition: all .5s ease;
  }
  .sys-header{
    height: 40px;
}
</style>