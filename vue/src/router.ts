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
      path: '/member/intro',
      name: 'member.intro',
      component: () => System.import('./components/member/intro.comp.vue'),
    },
    {
      path: '/my',
      name: 'my',
      component: () => System.import('./components/my/my.comp.vue'),
    },
    {
      path: '/my/member',
      name: 'my.member',
      alias: '/member/info', // compatible with angular
      component: () => System.import('./components/my/member.comp.vue'),
      children: [
        {
          path: 'rights/:id',
          name: 'my.member.rights',
          component: () => System.import('./components/my/member-rights.comp.vue'),
        },
      ]
    },
    {
      path: '/my/orders',
      name: 'my.orders',
      component: () => System.import('./components/my/order.comp.vue'),
    },
    {
      path: '/my/tickets',
      name: 'my.tickets',
      component: () => System.import('./components/my/ticket.comp.vue'),
    },
    {
      path: '/my/address',
      name: 'my.address',
      component: () => System.import('./components/my/address.comp.vue'),
      children: [
        {
          path: 'edit/:id?',
          name: 'my.address.edit',
          component: () => System.import('./components/my/edit-address.comp.vue'),
        },
      ]
    },
    {
      path: '/order/:id?',
      name: 'order',
      component: () => System.import('./components/order/order.comp.vue'),
    },
    {
      path: '/events/:id/tickets',
      name: 'event.ticket',
      component: () => System.import('./components/event/ticket.comp.vue'),
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
    {
      path: '*',
      component: () => System.import('./components/notfound/notfound.comp.vue'),
    }
  ]
});
