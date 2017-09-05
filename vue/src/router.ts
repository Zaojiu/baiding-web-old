import Vue from 'vue';
import Router, {RawLocation, Route} from 'vue-router';

import appComp from './components/app.comp.vue';
import talksComp from './components/talks/talks.comp.vue';
import errorComp from './components/error/error.comp.vue';
import {authGuard} from "./shared/guard/user-auth.guard";
import {beforeRouteEnter} from "./shared/guard/before-route-enter";
import {mobileBindedGuard} from "./shared/guard/mobile-binded.guard";
import {memberActivateCompGuard} from "./shared/guard/member-activate-comp.guard";
import {getRelativePath} from "./shared/utils/utils";
import {signinGuard} from "./shared/guard/signin-comp.guard";
import {mobileBindedCompGuard} from "./shared/guard/mobile-binded-comp.guard";

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
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const redirectTo = getRelativePath(to.query['redirectTo'], '/lives');
        const guards = [signinGuard(redirectTo)];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/signin/signin.comp.vue'),
    },
    {
      path: '/mobile-bind',
      name: 'mobileBind',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedCompGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/signin/mobile-bind.comp.vue'),
    },
    {
      path: '/forget-password',
      name: 'forgetPassword',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const redirectTo = getRelativePath(to.query['redirectTo'], '/lives');
        const guards = [signinGuard(redirectTo)];
        beforeRouteEnter(guards, to, from, next);
      },
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
          beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
            const guards = [authGuard()];
            beforeRouteEnter(guards, to, from, next);
          },
          component: () => System.import('./components/talks/comments/comments.comp.vue'),
        }
      ]
    },
    {
      path: '/member/activate',
      name: 'member.activate',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard(), memberActivateCompGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/member/activate.comp.vue'),
    },
    {
      path: '/member/intro',
      name: 'member.intro',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/member/intro.comp.vue'),
    },
    {
      path: '/my',
      name: 'my',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/my/my.comp.vue'),
    },
    {
      path: '/my/member',
      name: 'my.member',
      alias: '/member/info', // compatible with angular
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
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
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/my/order.comp.vue'),
    },
    {
      path: '/my/tickets',
      name: 'my.tickets',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/my/ticket.comp.vue'),
    },
    {
      path: '/my/address',
      name: 'my.address',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
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
      path: '/orders/:id?',
      name: 'order',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
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
