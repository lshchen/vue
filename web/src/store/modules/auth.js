import Vue from 'vue'
import Router from '@/router'
import RouterDate from '@/router/route.json'
import RouterDateForGroup from '@/router/routeForGroup.json'

const state = {
  token: '',
  refreshToken: '',
  machineCode: '',
  navList: [],
  auths: {},
  homePath: '/main/home/home-shop-seller'
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
  // 登录
  login ({ commit }, userForm) {
    return new Promise((resolve) => {
      let param = {
        scope: 'openid',
        username: userForm.username,
        password: userForm.password,
        grant_type: 'password'
      }
      let that = this
      let userCode = that.state.user.machineCodeKey
      // 登录
      Vue.prototype.loginRequest(param, Vue.prototype.getLocalStoreValue(userCode), function (result) {
        // 保存token
        commit('setToken', result.data.access_token)
        commit('setMachineCode', Vue.prototype.getLocalStoreValue(userCode))
        // 获取用户信息
        Vue.prototype.get('/sale/api/v1/account/mobile/' + userForm.username, {}, function (result) {
          Vue.prototype.post('/sale/api/v1/login', {}, () => {
            let organizations = result.data.accountDetailVO.accountOrganizations || []
            let stors = result.data.accountDetailVO.stores || []
            let roleCode = result.data.accountDetailVO.roleCode
            if (result.data.accountDetailVO.homePath) {
              commit('setHomePath', result.data.accountDetailVO.homePath)
            } else {
              commit('setHomePath', '/main/home/home-common')
            }
            Vue.prototype.setLocalStoreValue('account-city', userForm.cityItem)
            Vue.prototype.setLocalStoreValue('account-number', userForm.username)
            commit('user/setOrganizationList', organizations, { root: true })
            commit('user/setStoreList', stors, { root: true })
            commit('user/setUserInfo', result.data, { root: true })
            // 判断是否已经修改过密码
            if (userForm.password === '123456' || userForm.password === result.data.mobile) {
              commit('user/setChangePwd', false, { root: true })
            }
            Vue.prototype.get('/rbac/api/v1/permission/common/' + roleCode, {}, (auths) => {
              if (auths.data.length > 0) {
                let authsMap = {}
                auths.data.forEach(item => {
                  authsMap[item.subModelCode + '-' + item.element] = item.value
                })
                commit('setAuths', authsMap)
                // resolve('success')
              }
              // else {
              // resolve('该用户没有配置权限，请联系管理员')
              // }
              resolve('success')
            }, () => {
              resolve('获取权限失败')
            })
          }, () => {
            resolve('打卡失败')
          })
        }, function (errResult) {
          if (errResult.response.data.error) {
            resolve(errResult.response.data.error)
          } else {
            resolve('获取用户信息失败')
          }
        })
      }, function (errResult) {
        if (errResult && errResult.response) {
          // 提示错误信息
          if (errResult.response.data.message) {
            resolve(errResult.response.data.message)
          } else if (errResult.response.data.error) {
            resolve(errResult.response.data.error)
          }
          if (errResult.response.headers.machinecode) {
            // 如果有先删除
            if (Vue.prototype.getLocalStoreValue(userCode)) {
              Vue.prototype.deleteLocalStoreValue(userCode)
            }
            Vue.prototype.setLocalStoreValue(userCode, errResult.response.headers.machinecode)
          }
        }
      })
    })
  },
  loginForHomeWithGroup ({ commit }, userForm) {
    return new Promise((resolve) => {
      let param = {
        scope: 'openid',
        username: userForm.username,
        password: userForm.password,
        grant_type: 'password'
      }
      let that = this
      let userCode = that.state.user.machineCodeKey
      // 登录
      Vue.prototype.loginRequest(param, Vue.prototype.getLocalStoreValue(userCode), function (result) {
        // 保存token
        commit('setToken', result.data.access_token)
        commit('setMachineCode', Vue.prototype.getLocalStoreValue(userCode))
        // 保存用户mobile
        commit('user/setMobile', userForm.username, { root: true })
        commit('user/setIsNotHome', false, { root: true })
        Vue.prototype.setLocalStoreValue('account-city', userForm.cityItem)
        Vue.prototype.setLocalStoreValue('account-number', userForm.username)
        // 获取权限
        Vue.prototype.get('sale/api/v1/group/permission/user?modelCode=系统通用权限&isSimpleMode=0', {}, (auths) => {
          if (auths.data.length > 0) {
            let authsArr = auths.data
            let authsMap = {}
            let homePathArr = ['集团总裁', '集团其他', '通用']
            let homePathArrKey = ['homeGroup', 'homeGroupOther', 'homeCommon']
            let homePath = {
              homeCommon: '/main/home/home-common',
              homeGroup: '/main/home/home-group',
              homeGroupOther: '/main/home/home-group-other'
            }
            let setHomePath = function (index = 2) {
              commit('setHomePath', homePath[ homePathArrKey[index] ])
            }
            authsArr = authsArr.map(({ permissionList }) => permissionList[0])
            let authType = '通用'
            authsArr.forEach((item) => {
              if (item.element === '首页') {
                authType = item.value
              }
            })
            if (authType) {
              let authsKeyIndex = homePathArr.indexOf(authType)
              setHomePath(authsKeyIndex)
            } else {
              setHomePath()
            }
            authsArr.forEach(item => {
              authsMap[item.subModelCode + '-' + item.element] = item.value
            })
            commit('setAuths', authsMap)
          }
          resolve('success')
        }, () => {
          resolve('获取权限失败')
        })
      }, function (errResult) {
        if (errResult && errResult.response) {
          // 提示错误信息
          if (errResult.response.data.message) {
            resolve(errResult.response.data.message)
          } else if (errResult.response.data.error) {
            resolve(errResult.response.data.error)
          }
          if (errResult.response.headers.machinecode) {
            // 如果有先删除
            if (Vue.prototype.getLocalStoreValue(userCode)) {
              Vue.prototype.deleteLocalStoreValue(userCode)
            }
            Vue.prototype.setLocalStoreValue(userCode, errResult.response.headers.machinecode)
          }
        }
      })
    })
  },

  // 登出
  logout ({commit}) {
    return new Promise((resolve) => {
      commit('setToken', '')
      commit('setNavList', [])
      commit('user/setUserInfo', '', { root: true })
      commit('tagNav/removeTagNav', '', { root: true })

      commit('config/setDictionaryList', [], { root: true })
      commit('config/setOssDomain', '', { root: true })
      commit('config/setOrganizationList', [], { root: true })
      commit('config/setPositionList', [], { root: true })
      commit('config/setPersonnelList', [], { root: true })
      commit('config/setStoreList', [], { root: true })
      commit('config/setPersonnelHashCode', '', { root: true })
      commit('config/setStoreHashCode', '', { root: true })
      commit('user/setHomeNoticeChange', '', { root: true })
      commit('user/setIsNotHome', false, { root: true })

      resolve()
    })
  },

  // 集团登出
  groupLogOut ({ commit }, obj) {
    return new Promise((resolve) => {
      commit('setNavList', [])
      commit('user/setCurCity', '', { root: true })
      // commit('user/setGroupUserInfo', '', { root: true })
      commit('tagNav/removeTagNav', '', { root: true })
      commit('config/setDictionaryList', [], { root: true })
      commit('config/setOssDomain', '', { root: true })
      commit('config/setOrganizationList', [], { root: true })
      commit('config/setPositionList', [], { root: true })
      commit('config/setPersonnelList', [], { root: true })
      commit('config/setStoreList', [], { root: true })
      commit('config/setPersonnelHashCode', '', { root: true })
      commit('config/setStoreHashCode', '', { root: true })
      commit('user/setHomeNoticeChange', '', { root: true })
      resolve()
    })
  },

  // 集团切换城市时登入
  groupLogIn ({ commit }, obj) {
    return new Promise((resolve) => {
      let that = this
      let userCode = that.state.user.machineCodeKey
      // 获取用户信息
      Vue.prototype.get('/sale/api/v1/account/mobile/' + obj.mobile, {}, function (result) {
        Vue.prototype.post('/sale/api/v1/login', {}, () => {
          let roleCode = result.data.accountDetailVO.roleCode
          let organizations = result.data.accountDetailVO.accountOrganizations || []
          let stors = result.data.accountDetailVO.stores || []
          if (result.data.accountDetailVO.homePath) {
            // commit('setHomePath', result.data.accountDetailVO.homePath)
            commit('setHomePath', '/main/home/home-city-manger')
          } else {
            commit('setHomePath', '/main/home/home-common')
          }
          Vue.prototype.setLocalStoreValue('account-city', obj.id)
          Vue.prototype.setLocalStoreValue('account-number', obj.mobile)
          commit('user/setOrganizationList', organizations, { root: true })
          commit('user/setStoreList', stors, { root: true })
          commit('user/setUserInfo', result.data, { root: true })
          Vue.prototype.get('/rbac/api/v1/permission/common/' + roleCode, {}, (auths) => {
            if (auths.data.length > 0) {
              let authsMap = {}
              auths.data.forEach(item => {
                authsMap[item.subModelCode + '-' + item.element] = item.value
              })
              commit('setAuths', authsMap)
              // resolve('success')
            }
            // else {
            // resolve('该用户没有配置权限，请联系管理员')
            // }
            resolve('success')
          }, () => {
            resolve('获取权限失败')
          })
        }, () => {
          resolve('打卡失败')
        })
      }, function (errResult) {
        if (errResult.response.data.error) {
          resolve(errResult.response.data.error)
        } else {
          resolve('获取用户信息失败')
        }
      })
    })
  },

  // 回到集团
  loginForGroup ({ commit }, obj) {
    return new Promise((resolve) => {
      let that = this
      let userCode = that.state.user.machineCodeKey
      Vue.prototype.setLocalStoreValue('account-city', obj.companyId)
      Vue.prototype.setLocalStoreValue('account-number', obj.mobile)
      // 获取权限
      Vue.prototype.get('sale/api/v1/group/permission/user?modelCode=系统通用权限&isSimpleMode=0', {}, (auths) => {
        if (auths.data.length > 0) {
          let authsArr = auths.data
          let authsMap = {}
          let homePathArr = ['集团总裁', '集团其他', '通用']
          let homePathArrKey = ['homeGroup', 'homeGroupOther', 'homeCommon']
          let homePath = {
            homeCommon: '/main/home/home-common',
            homeGroup: '/main/home/home-group',
            homeGroupOther: '/main/home/home-group-other'
          }
          let setHomePath = function (index = 2) {
            commit('setHomePath', homePath[homePathArrKey[index]])
          }
          authsArr = authsArr.map(({ permissionList }) => permissionList[0])
          let authType = '通用'
          authsArr.forEach((item) => {
            if (item.element === '首页') {
              authType = item.value
            }
          })
          if (authType) {
            let authsKeyIndex = homePathArr.indexOf(authType)
            setHomePath(authsKeyIndex)
          } else {
            setHomePath()
          }
          authsArr.forEach(item => {
            authsMap[item.subModelCode + '-' + item.element] = item.value
          })
          commit('setAuths', authsMap)
        }
        resolve('success')
      }, () => {
        resolve('获取权限失败')
      })
    })
  },

  // 获取该用户的菜单列表
  getNavList ({commit, state}, companyId) {
    if (companyId !== 'group') { // 非集团首页
      return navListForNotGroup()
    } else {
      return navListForGroup()
    }
    // 集团菜单
    function navListForGroup () {
      return new Promise((resolve) => {
        var menu = []
        let copyRouterDate = JSON.parse(JSON.stringify(RouterDateForGroup))
        copyRouterDate[0].path = state.homePath

        let routeMap = {}
        let arrForRouters = Router.options.routes[1].children
        for (let index = 0; index < arrForRouters.length; index++) {
          const element = arrForRouters[index]
          if (element.auth) {
            routeMap['/main/' + element.path] = element.auth
          }
        }
        function getNavListByAuth (list) {
          for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (routeMap[element.path] && !Vue.prototype.ifHasAuth(routeMap[element.path])) {
              list.splice(index, 1)
              index--
            }
          }
          return list
        }
        let copyRouterSubList = getNavListByAuth(copyRouterDate[1].subList)
        if (copyRouterSubList.length > 0) {
          copyRouterDate[1].subList = copyRouterSubList
        } else {
          copyRouterDate = copyRouterDate.splice(0, 1)
        }
        menu = copyRouterDate
        commit('setNavList', menu)
        resolve(menu)
      })
    }
    // 非集团菜单
    function navListForNotGroup () {
      return new Promise((resolve) => {
        var ret = [] // 判断是否重复的数组
        var menu = [] // 生效的数组
        let copyRouterDate = JSON.parse(JSON.stringify(RouterDate))
        copyRouterDate[0].path = state.homePath
        for (var i = 0; i < copyRouterDate.length; i++) {
          if (ret.indexOf(copyRouterDate[i].name) === -1) {
            ret.push(copyRouterDate[i].name)
            menu.push(copyRouterDate[i])
          }
        }
        let routeMap = {}
        let routers = Router.options.routes[1].children
        for (let index = 0; index < routers.length; index++) {
          const element = routers[index]
          if (element.auth) {
            routeMap['/main/' + element.path] = element.auth
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
        commit('setNavList', menu)
        resolve(menu)
      })
    }
  }

  // 将菜单列表扁平化形成权限列表
  // getPermissionList ({state}) {
  //   return new Promise((resolve) => {
  //     let permissionList = []
  //     // 将菜单数据扁平化为一级
  //     function flatNavList (arr) {
  //       for (let v of arr) {
  //         if (v.child && v.child.length) {
  //           flatNavList(v.child)
  //         } else {
  //           permissionList.push(v)
  //         }
  //       }
  //     }
  //     flatNavList(state.navList)
  //     resolve(permissionList)
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
