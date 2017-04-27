import Vue from 'vue'
import Router from 'vue-router'
import App from './components/app.comp.vue'
import Talks from './components/talks/talks.comp.vue'
import Comments from './components/talks/comments/comments.comp.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: App
    },
    {
      path: '/talks/:id',
      component: Talks,
      children: [
        { path: '' },
        {
          path: 'post-comment',
          component: Comments
        }
      ]
    }
  ]
})
