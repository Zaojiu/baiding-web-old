import Vue from 'vue';
import Router from 'vue-router';

import appComp from './components/app.comp.vue';
import postCommentComp from './components/talks/comments/comments.comp.vue';
import talksComp from './components/talks/talks.comp.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: appComp,
    },
    {
      path: '/talks/:id',
      component: talksComp,
      children: [
        { path: '' },
        {
          path: 'post-comment',
          component: postCommentComp,
        }
      ]
    }
  ]
})
