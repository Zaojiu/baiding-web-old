import Vue from 'vue'
import Vuex from 'vuex'
import talkStore from './talk'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    talks: talkStore
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
