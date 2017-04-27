import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/app.comp.vue'
import router from './router'
import store from './store'

sync(store, router)

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
