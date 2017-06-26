import Vue from 'vue'
import Vuex from 'vuex'
import talkStore from './talk'
import tipStore from './tip'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    talks: talkStore,
    tip: tipStore
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
