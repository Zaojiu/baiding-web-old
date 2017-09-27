import './shared/utils/weinre';
import './shared/utils/polyfill';
import './shared/icons.font.js';

import Vue, {ComponentOptions} from 'vue'
import { sync } from 'vuex-router-sync'
import appComp from './components/app.comp.vue'
import router from './router'
import { store } from './store'
import bdLoading from './shared/bd-loading.comp.vue';
import error from './shared/error.comp.vue';

sync(store, router);

const app = new Vue({
  router,
  store,
  ...appComp,
} as ComponentOptions<Vue>);

Vue.component('bd-loading', bdLoading);
Vue.component('error', error);

app.$mount('#app');
