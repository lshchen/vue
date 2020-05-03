import Vue from 'vue'
import Router from '../../router'
import RouterDate from '../../router/route.json'

const state = {
  token: '',
  refreshToken: '',
  machineCode: '',
  navList: [],
  auths: {},
  homePath: '/home/home-common'
}

const mutations = {
  setNavList: (state, data) => {
    state.navList = data
  },
  setToken: (state, data) => {
    state.token = data
    state.refreshToken = data
  },
  setMachineCode: (state, data) => {
    state.machineCode = data
  },
  setAuths: (state, data) => {
    state.auths = data
  },
  setHomePath: (state, data) => {
    state.homePath = data
  }
}

const actions = {
  // 获取该用户的菜单列表
  getNavList ({ commit, state }, companyId) {
    return navListForNotGroup()
    // 非集团菜单
    function navListForNotGroup () {
      return new Promise((resolve) => {
        var ret = [] // 判断是否重复的数组
        var menu = [] // 生效的数组
        const copyRouterDate = JSON.parse(JSON.stringify(RouterDate))
        // copyRouterDate[0].path = state.homePath
        for (var i = 0; i < copyRouterDate.length; i++) {
          if (ret.indexOf(copyRouterDate[i].name) === -1) {
            ret.push(copyRouterDate[i].name)
            menu.push(copyRouterDate[i])
          }
        }
        const routeMap = {}
        const routers = Router.options.routes[1].children
        for (let index = 0; index < routers.length; index++) {
          const element = routers[index]
          if (element.auth) {
            routeMap['/home/' + element.path] = element.auth
          }
        }
        function getNavListByAuth (list) {
          for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (routeMap[element.path] && !Vue.prototype.ifHasAuth(routeMap[element.path])) {
              list.splice(index, 1)
              index--
            }
            if (element.subList.length > 0) {
              getNavListByAuth(element.subList)
            }
            if (!element.path && element.subList.length === 0) {
              list.splice(index, 1)
              index--
            }
          }
          return list
        }
        menu = getNavListByAuth(menu)
        console.log(menu)
        commit('setNavList', menu)
        resolve(menu)
      })
    }
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
