import Vue from 'vue';
import Vuex from 'vuex';

import {talkStore} from './talk';
import {userStore} from './user';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    talks: talkStore,
    user: userStore,
  },
  strict: true,
});
