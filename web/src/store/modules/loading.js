
const state = {
  isLoading: false,
  isLocking: false,
  isRefresh: false // 是否刷新
}

const mutations = {
  changeIsLoading: (state, bool) => {
    state.isLoading = bool
  },
  changeIsLocking: (state, bool) => {
    state.isLocking = bool
  },
  setIsRefresh (state, changeValue) {
    state.isRefresh = changeValue
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
