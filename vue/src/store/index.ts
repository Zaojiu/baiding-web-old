import Vue from 'vue';
import Vuex from 'vuex';

import {talkStore} from './talk';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    talks: talkStore,
  },
  strict: true,
});
