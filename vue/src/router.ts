import Vue from 'vue';
import Router, {RawLocation, Route} from 'vue-router';

import appComp from './components/app.comp.vue';
import talksComp from './components/talks/content.comp.vue';
import errorComp from './components/error/error.comp.vue';
import {authGuard} from "./shared/guard/user-auth.guard";
import {beforeRouteEnter} from "./shared/guard/before-route-enter";
import {mobileBindedGuard} from "./shared/guard/mobile-binded.guard";
import {memberActivateCompGuard} from "./shared/guard/member-activate-comp.guard";
import {getRelativePath, scrollPosition, setTitle} from "./shared/utils/utils";
import {signinGuard} from "./shared/guard/signin-comp.guard";
import {mobileBindedCompGuard} from "./shared/guard/mobile-binded-comp.guard";

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  scrollBehavior() {
    return scrollPosition;
  },
  routes: [
    {
      path: '/',
      component: appComp,
    },
    {
      path: '/lives',
      name: 'lives',
      component: () => System.import('./components/lives/lives.comp.vue'),
    },
    {
      path: '/signin',
      name: 'signin',
      meta: {
        title: '登录',
      },
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
      meta: {
        title: '绑定手机',
      },
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedCompGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/signin/mobile-bind.comp.vue'),
    },
    {
      path: '/forget-password',
      name: 'forgetPassword',
      meta: {
        title: '忘记密码',
      },
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
          meta: {
            title: '发表评论',
          },
          beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
            const guards = [authGuard(), mobileBindedGuard()];
            beforeRouteEnter(guards, to, from, next);
          },
          component: () => System.import('./components/talks/post-comment.comp.vue'),
        }
      ]
    },
    {
      path: '/member/activate',
      name: 'member.activate',
      meta: {
        title: '激活会员',
      },
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard(), memberActivateCompGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/member/activate.comp.vue'),
    },
    {
      path: '/member/intro',
      name: 'member.intro',
      meta: {
        title: '造就会员',
      },
      component: () => System.import('./components/member/intro.comp.vue'),
    },
    {
      path: '/my',
      name: 'my',
      meta: {
        title: '个人中心',
      },
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/my/my.comp.vue'),
    },
    {
      path: '/my/member',
      name: 'my.member',
      meta: {
        title: '会员',
      },
      alias: '/member/info', // compatible with angular
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/my/member.comp.vue'),
      children: [
        {
          path: 'rights/:id',
          meta: {
            title: '会员权益',
          },
          name: 'my.member.rights',
          component: () => System.import('./components/my/member-rights.comp.vue'),
        },
      ]
    },
    {
      path: '/my/orders',
      name: 'my.orders',
      meta: {
        title: '我的订单',
      },
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/my/order.comp.vue'),
    },
    {
      path: '/my/tickets',
      name: 'my.tickets',
      meta: {
        title: '我的票券',
      },
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/my/ticket.comp.vue'),
    },
    {
      path: '/my/address',
      name: 'my.address',
      meta: {
        title: '收货地址',
      },
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
      name: 'orders',
      meta: {
        title: '订单',
      },
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/order/order.comp.vue'),
    },
    {
      path: '/events/:id/tickets',
      name: 'event.ticket',
      meta: {
        title: '购票',
      },
      component: () => System.import('./components/event/ticket.comp.vue'),
    },
    {
      path: '/columns',
      name: 'column',
      meta: {
        title: '专栏',
      },
      component: () => System.import('./components/columns/list.comp.vue'),
    },
    {
      path: '/columns/:id',
      name: 'column.cover',
      component: () => System.import('./components/columns/cover.comp.vue'),
    },
    {
      path: '/columns/:id/items/:itemId',
      beforeEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
        const guards = [authGuard(), mobileBindedGuard()];
        beforeRouteEnter(guards, to, from, next);
      },
      component: () => System.import('./components/columns/content.comp.vue'),
      children: [
        {
          name: 'column.item.main',
          path: ''
        },
        {
          name: 'column.item.post-comment',
          path: 'post-comment',
          meta: {
            title: '发表评论',
          },
          component: () => System.import('./components/columns/post-comment.comp.vue'),
        }
      ]
    },
    {
      path: '/500',
      name: 'error',
      component: errorComp,
    },
    {
      path: '/404',
      name: 'notfound',
      component: () => System.import('./components/notfound/notfound.comp.vue'),
    },
    {
      path: '*',
      component: () => System.import('./components/notfound/notfound.comp.vue'),
    }
  ]
});

export default router;

export let preRoute: Route;

router.afterEach((to, from) => {
  preRoute = from;
  const title = to.meta.title ? `${to.meta.title}-造就` : '造就';
  setTitle(title);
});
