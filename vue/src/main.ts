import './shared/utils/polyfill';
import './shared/icons.font.js';

import Vue, {ComponentOptions} from 'vue'
import { sync } from 'vuex-router-sync'
import appComp from './components/app.comp.vue'
import router from './router'
import { store } from './store'

sync(store, router);

const app = new Vue({
  router,
  store,
  ...appComp,
} as ComponentOptions<Vue>);

app.$mount('#app');
