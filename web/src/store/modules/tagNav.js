const state = {
  // 已经打开的页面
  openedPageList: [],
  savedPosition: {}
}

const mutations = {
  addTagNav (state, data) {
    if (state.openedPageList.some(v => v.fullPath === data.fullPath)) return
    state.openedPageList.push(data)
  },
  removeTagNav (state, data) {
    if (data) {
      for (let [i, v] of state.openedPageList.entries()) {
        if (v.fullPath === data.fullPath) {
          state.openedPageList.splice(i, 1)
          if (Object.keys(state.savedPosition).includes(v.title)) {
            state.savedPosition[v.title] = 0
          }
        }
      }
    } else {
      state.openedPageList = []
      state.savedPosition = {}
    }
  },
  removeTagLeft (state, Number) {
    if (Number > 0) {
      let delts = state.openedPageList.splice(1, Number)
      for (var i = 0; i < delts.length; i++) {
        if (Object.keys(state.savedPosition).includes(delts[i].title)) {
          state.savedPosition[delts[i].title] = 0
        }
      }
    }
  },
  removeTagRight (state, Number) {
    let delts = state.openedPageList.splice(Number + 1)
    for (var i = 0; i < delts.length; i++) {
      if (Object.keys(state.savedPosition).includes(delts[i].title)) {
        state.savedPosition[delts[i].title] = 0
      }
    }
  },
  removeTagOther (state, data) {
    let args = []
    let delts = []
    if (data) {
      args = state.openedPageList.splice(1, data - 1)
      delts = [...state.openedPageList.splice(2), ...args]
      for (var i = 0; i < delts.length; i++) {
        if (Object.keys(state.savedPosition).includes(delts[i].title)) {
          state.savedPosition[delts[i].title] = 0
        }
      }
    } else {
      state.openedPageList.splice(1)
      state.savedPosition = {}
    }
  },
  removeTagAll (state, data) {
    state.openedPageList.splice(1)
    state.savedPosition = {}
  },
  setPosition (state, data) {
    state.savedPosition[data.key] = data.value
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
