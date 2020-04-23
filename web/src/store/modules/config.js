import Vue from 'vue'

const state = {
  dictionaryList: [],
  ossDomain: '',
  organizationList: [],
  positionList: [],
  PersonnelList: [],
  StoreList: [],
  BuildList: [],
  personnelHashCode: '', // 人员tree十分钟更新
  storeHashCode: '', // 门店tree十分钟更新
  buildHashCode: '' // 楼盘字典tree十分钟更新
}

const mutations = {
  setDictionaryList: (state, data) => {
    state.dictionaryList = data
  },
  setOssDomain: (state, data) => {
    state.ossDomain = data
  },
  setOrganizationList: (state, data) => {
    state.organizationList = data
  },
  setPositionList: (state, data) => {
    state.positionList = data
  },
  setPersonnelList: (state, data) => {
    state.PersonnelList = data
  },
  setStoreList: (state, data) => {
    state.StoreList = data
  },
  setBuildList: (state, data) => {
    state.BuildList = data
  },
  setPersonnelHashCode: (state, data) => {
    state.personnelHashCode = data
  },
  setStoreHashCode: (state, data) => {
    state.storeHashCode = data
  },
  setBuildHashCode: (state, data) => {
    state.buildHashCode = data
  }
}

const actions = {
  loadDictData ({ commit }) {
    return new Promise((resolve) => {
      if (!state.dictionaryList || state.dictionaryList.length === 0) {
        Vue.prototype.get('/sale/api/v1/dictionary', {}, function (result) {
          commit('setDictionaryList', result.data)
          resolve('success')
        }, function (errResult) {
          resolve('查询字典数据失败')
        })
      }
    })
  },
  loadOssDomain ({ commit }) {
    return new Promise((resolve) => {
      if (!state.ossDomain) {
        Vue.prototype.get('/sale/api/v1/upload/oss/domain', {}, function (result) {
          // 保存token
          commit('setOssDomain', result.data)
          resolve('success')
        }, function (errResult) {
          resolve('查询ossDomain失败')
        })
      }
    })
  },
  loadOrganization ({ commit }) {
    return new Promise((resolve) => {
      if (!state.organizationList || state.organizationList.length === 0) {
        Vue.prototype.get('/sale/api/v1/organization/all', {}, function (result) {
          commit('setOrganizationList', result.data)
          resolve('success')
        }, function (errResult) {
          resolve('查询组织失败')
        })
      }
    })
  },
  loadPosition ({ commit }) {
    return new Promise((resolve) => {
      if (!state.positionList || state.positionList.length === 0) {
        Vue.prototype.get('/sale/api/v1/position', {}, function (result) {
          commit('setPositionList', result.data)
          resolve('success')
        }, function (errResult) {
          resolve('查询职位失败')
        })
      }
    })
  },
  loadPersonnel ({ commit }) {
    return new Promise((resolve) => {
      Vue.prototype.get('/sale/api/v1/selector/account?hashCode=' + state.personnelHashCode, {}, function (result) {
        if (result.data.hashCode !== state.personnelHashCode) {
          commit('setPersonnelList', JSON.parse(result.data.data))
          commit('setPersonnelHashCode', result.data.hashCode)
        }
        resolve('success')
      }, function (errResult) {
        resolve('查询人员失败')
      })
    })
  },
  loadStore ({ commit }) {
    return new Promise((resolve) => {
      Vue.prototype.get('/sale/api/v1/selector/store?hashCode=' + state.storeHashCode, {}, function (result) {
        if (result.data.hashCode !== state.storeHashCode) {
          commit('setStoreList', JSON.parse(result.data.data))
          commit('setStoreHashCode', result.data.hashCode)
        }
        resolve('success')
      }, function (errResult) {
        resolve('查询门店失败')
      })
    })
  },
  loadBuild ({ commit }) {
    return new Promise((resolve) => {
      Vue.prototype.get('/sale/api/v1/selector/district/region?hashCode=' + state.buildHashCode, {}, function (result) {
        if (result.data.hashCode !== state.buildHashCode) {
          commit('setBuildList', JSON.parse(result.data.data))
          commit('setBuildHashCode', result.data.hashCode)
        }
        resolve('success')
      }, function (errResult) {
        resolve('查询门店失败')
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
