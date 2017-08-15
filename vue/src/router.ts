import Vue from 'vue';
import Router from 'vue-router';

import appComp from './components/app.comp.vue';
import postCommentComp from './components/talks/comments/comments.comp.vue';
import talksComp from './components/talks/talks.comp.vue';
import signinComp from './components/signin/signin.comp.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: appComp,
    },
    {
      path: '/signin',
      component: signinComp,
    },
    {
      path: '/talks/:id',
      component: talksComp,
      children: [
        {
          name: 'talks.main',
          path: ''
        },
        {
          name: 'talks.post-comment',
          path: 'post-comment',
          component: postCommentComp,
        }
      ]
    }
  ]
});
