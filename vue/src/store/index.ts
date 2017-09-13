import Vue from 'vue';
import Vuex from 'vuex';

import {userStore} from './user';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    user: userStore,
  },
  strict: true,
});
