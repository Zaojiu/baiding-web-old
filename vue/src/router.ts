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
      path: '/lives',
      name: 'index',
      component: () => System.import('./components/index/index.comp.vue'),
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => System.import('./components/signin/signin.comp.vue'),
    },
    {
      path: '/mobile-binded',
      name: 'mobileBinded',
      component: () => System.import('./components/signin/mobile-binded.comp.vue'),
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
      path: '/member/activate',
      name: 'member.activate',
      component: () => System.import('./components/member/activate.comp.vue'),
    },
    {
      path: '/500',
      name: 'error',
      component: errorComp,
    },
    {
      path: '/400',
      name: 'notfound',
      component: () => System.import('./components/notfound/notfound.comp.vue'),
    },
  ]
});
