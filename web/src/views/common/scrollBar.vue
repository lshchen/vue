<script src="../../../../../qiji/sale-client/src/renderer/main.js"></script>
<template>
<div style="height:100%;">
  <span v-if="show" class="nav-left" @click="navleft">
    <i class="el-icon-arrow-left"></i>
  </span>
  <div id="scroll-cont" class="scroll-wrap" ref="scrollWrap">
      <div id="scroll-conts"  class="scroll-cont" ref="scrollCont" :style="{left: left + 'px'}">
          <slot></slot>
      </div>
  </div>
  <span v-if="show" class="nav-right" @click="navright">
    <i class="el-icon-arrow-right"></i>
  </span>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      left: 0,
      wheelSpeed: 30,
      show: false
    }
  },
  computed: {
    ...mapGetters(['openedPageList'])
  },
  watch: {
    openedPageList: function () {
      const timer = setTimeout(() => {
        let wid = document.getElementById('scroll-cont')
        let tid = document.getElementById('scroll-conts')
        if (wid && tid) {
          if (tid.offsetWidth - wid.offsetWidth > 20) {
            this.show = true
          } else {
            this.show = false
            this.left = 0
          }
        }
      })
      this.clearTimer(timer)
    }
  },
  methods: {
    navleft () {
      if (this.left < 0) {
        this.left > -100 ? this.left = 0 : this.left += 100
      } else {
        this.left = 0
      }
    },
    navright () {
      let wid = document.getElementById('scroll-cont')
      let newleft = this.left
      if (wid.offsetWidth - newleft < wid.scrollWidth) {
        this.left -= 100
      }
    },
    scroll (e) {
      const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
      const scrollContWidth = this.$refs.scrollCont.offsetWidth
      if (scrollContWidth > scrollWrapWidth) {
        // 统一不同浏览器下wheel事件的滚动值
        // chrome/FF/Edge/IE11/IE10/IE9
        // e.deltaY > 0 即鼠标滚轮向下滚动，则该条向右滚动，left值变负
        const scrollSpace = e.deltaY > 0 ? -1 * this.wheelSpeed : this.wheelSpeed
        if (e.deltaY > 0) {
          if (Math.abs(this.left + scrollSpace) <= (scrollContWidth - scrollWrapWidth)) {
            this.left += scrollSpace
          }
        } else {
          if (this.left + scrollSpace < 0) {
            this.left += scrollSpace
          } else {
            this.left = 0
          }
        }
      }
    },
    scrollToCurTag (tar) {
      const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
      const tarWidth = tar.offsetWidth
      const tarLeft = tar.offsetLeft

      if (tarLeft < -1 * this.left) {
        // 激活的标签导航在左边
        this.left = -tarLeft
      } else if (tarLeft + tarWidth > scrollWrapWidth) {
        // 激活的标签导航在右边
        this.left = -(tarLeft + tarWidth - scrollWrapWidth)
      }
    }
  }
}
</script>
<style lang="scss"  scoped>
   .scroll-wrap{
    float: left;
    width: 96%;
  }
  .nav-left,.nav-right{
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover i{
      background:rgba($color: #000000, $alpha: 0.4);
      border-radius: 50%;
      color: #eee;
    }
    i{
      font-size: 20px;
      color: #333333;
      -webkit-font-smoothing: antialiased;
      font-family: element-icons!important;
      font-style: normal;
      font-variant: normal;
      font-weight: 400;
      line-height: 1;
      text-transform: none;
    }
  }
  #scroll-cont{
    padding-top: 1px;
  }
</style>

