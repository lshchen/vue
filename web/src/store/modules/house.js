const state = {
  housePurpose: ''
}

const mutations = {
  // 设置房屋用途数据
  changeHousePurposeMutations (state, purpose) {
    state.housePurpose = purpose
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
