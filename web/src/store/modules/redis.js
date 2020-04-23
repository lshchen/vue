// import Vue from 'vue'

const state = {
  redisTableCols: []
}

const mutations = {
  setRedisTableCols: (state, key, cols) => {
    state.redisTableCols[key] = cols
  }
}

const actions = {
  // 从redis中获取动态列字段
  getTableCols ({ commit }, redisKey) {
    return new Promise((resolve) => {
      // 先从vuex中获取动态列值，如果不存在，从后台获取
      if (!state.redisTableCols[redisKey]) {
        // 从redis获取，获取后保存到vuex中
        commit('redis/setRedisTableCols', redisKey, '', { root: true })
        resolve('success')
      }
    })
  },
  changeTableCols ({ commit }, redisKey, cols) {
    return new Promise((resolve) => {
      // 更新redis，并更新vuex的值
      commit('redis/setRedisTableCols', redisKey, cols, { root: true })
      resolve('success')
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
