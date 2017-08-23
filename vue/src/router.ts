import Vue from 'vue';
import Router from 'vue-router';

import appComp from './components/app.comp.vue';
import talksComp from './components/talks/talks.comp.vue';
import errorComp from './components/error/error.comp.vue';

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
      name: 'signin',
      component: () => System.import('./components/signin/signin.comp.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => System.import('./components/signin/signup.comp.vue'),
    },
    {
      path: '/forget-password',
      name: 'forgetPassword',
      component: () => System.import('./components/signin/forget-password.comp.vue'),
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
          component: () => System.import('./components/talks/comments/comments.comp.vue'),
        }
      ]
    },
    {
      path: '/500',
      component: errorComp,
    },
  ]
});
