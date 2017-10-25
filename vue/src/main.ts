import './shared/utils/weinre';
import './shared/utils/polyfill';
import './shared/icons.font.js';

import Vue, {ComponentOptions} from 'vue'
import {router} from './router'
import {sync} from 'vuex-router-sync'
import {store} from './store'
import appComp from './components/app.comp.vue'
import topNav from './shared/top-nav.comp.vue';
import error from './shared/error.comp.vue';
import bdLoading from './shared/bd-loading.comp.vue';
import {getUserInfo} from "./shared/api/user.api";

sync(store, router);

const app = new Vue({
  router,
  store,
  ...appComp,
} as ComponentOptions<Vue>);

Vue.component('top-nav', topNav);
Vue.component('bd-loading', bdLoading);
Vue.component('error', error);

(async () => {
  try {
    await getUserInfo(false);
  } catch (e) {
  } finally {
    app.$mount('#app');
  }
})();

