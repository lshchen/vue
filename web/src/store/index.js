import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import user from './modules/user'
import tagNav from './modules/tagNav'
import redis from './modules/redis'
import config from './modules/config'
import loading from './modules/loading'
import house from './modules/house'

import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    user,
    tagNav,
    redis,
    config,
    house,
    loading
  },
  getters,
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  strict: process.env.NODE_ENV !== 'production'
})
