import Vue from "vue";
import Router, { Route } from "vue-router";

import baseComp from "./components/base.comp.vue";
import talksComp from "./components/talks/content.comp.vue";
import topic_post from "./components/topic_post/topic_post.comp.vue";
import errorComp from "./components/error/error.comp.vue";
import {
  authGuard,
  auth4MobileGuardN,
  auth4MobileGuard
} from "./shared/guard/user-auth.guard";
import {
  memberActionGuard,
  memberCardGuard,
  memberPlanGuard
} from "./shared/guard/mars-member.guard";
import { execRouteTask } from "./shared/guard/route-task";
import { mobileBindedGuard } from "./shared/guard/mobile-binded.guard";
import { memberActivateCompGuard } from "./shared/guard/member-activate-comp.guard";
import { getRelativePath, scrollPosition } from "./shared/utils/utils";
import {
  signinGuard,
  signin4BindMobileGuard
} from "./shared/guard/signin-comp.guard";
import {
  mobileBindedCompGuard,
  wechatBindMobileCompGuard
} from "./shared/guard/mobile-binded-comp.guard";
import { afterHooks, beforeHooks } from "./hooks";
import { liveInfoResolver } from "./shared/resolver/live-info.resolver";

import memberContainer from "./components/my/member/container.comp.vue";
import appMemberContainer from "./components/my/member/app-container.comp.vue";
//老版本iOS使用，未来可选择删除
import memberContent from "./components/my/iosInAppPayMember/content.comp.vue";
import iosMemberContainer from "./components/my/iosInAppPayMember/container.comp.vue";
//

import MemberVideoComponent from "./components/member_video/list.comp.vue";

import marsMemberDiscount from "./components/mars_member/discount.comp.vue";
import marsMemberContainer from "./components/mars_member/container.comp.vue";
import marsMemberCard from "./components/mars_member/card.comp.vue";
import marsMemberVideo from "./components/mars_member/video.comp.vue";
import marsMemberCourse from "./components/mars_member/course.comp.vue";
import marsMemberDownload from "./components/mars_member/download.comp.vue";
import marsMemberPlanList from "./components/mars_member/planList.comp.vue";


import itemMarsMemberDiscount from "./components/app_items/mars_member/discount.comp.vue";
import itemMarsMemberContainer from "./components/app_items/mars_member/container.comp.vue";
import itemMarsMemberCard from "./components/app_items/mars_member/card.comp.vue";
import itemMarsMemberVideo from "./components/app_items/mars_member/video.comp.vue";
import itemMarsMemberCourse from "./components/app_items/mars_member/course.comp.vue";
import itemMarsMemberDownload from "./components/app_items/mars_member/download.comp.vue";
import itemMarsMemberPlanList from "./components/app_items/mars_member/planList.comp.vue";
Vue.use(Router);

export const router = new Router({

  mode: "history",
  scrollBehavior(to: any, from: any, savedPosition: any): any {
    return scrollPosition;
  },
  routes: [
    {
      path: "/",
      component: baseComp,
      children: [
        {
          path: "/lives",
          name: "lives",
          component: () => System.import("./components/lives/lives.comp.vue")
        },
        {
          path: "/lives/:id/info",
          name: "live-info",
          beforeEnter(to, from, next) {
            const tasks = [liveInfoResolver()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/lives/live-info.comp.vue")
        },
        {
          path: "/signin",
          name: "signin",
          meta: {
            title: "登录"
          },
          beforeEnter(to, from, next) {
            const redirectTo = getRelativePath(
              to.query["redirectTo"],
              "/lives"
            );
            console.log(redirectTo);
            const tasks = [signinGuard(redirectTo)];
            execRouteTask(tasks, to, from, next);
          },

          component: () => System.import("./components/signin/signin.comp.vue")
        },
        {
          path: "/signin4BindMobile",
          name: "signin4BindMobile",
          meta: {
            title: "登录"
          },
          beforeEnter(to, from, next) {
            const redirectTo = getRelativePath(
              to.query["redirectTo"],
              "/mobile-bind-event"
            );
            const tasks = [signin4BindMobileGuard(redirectTo)];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/signin/signin.comp.vue")
        },
        {
          path: "/mobile-bind",
          name: "mobileBind",
          meta: {
            title: "绑定手机"
          },
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedCompGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/signin/mobile-bind.comp.vue")
        },
        {
          path: "/mobile-bind-event",
          name: "mobileBind.event",
          meta: {
            title: "绑定手机"
          },
          beforeEnter(to, from, next) {
            // const tasks = [wechatBindMobileCompGuard()];
            const tasks = [authGuard(), mobileBindedCompGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/signin/mobile-bind-event.comp.vue")
        },
        {
          path: "/forget-password",
          name: "forgetPassword",
          meta: {
            title: "忘记密码"
          },
          beforeEnter(to, from, next) {
            const redirectTo = getRelativePath(
              to.query["redirectTo"],
              "/lives"
            );
            const tasks = [signinGuard(redirectTo)];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/signin/forget-password.comp.vue")
        },
        {
          path: "/app_course/cover/:id",
          component: () =>
            System.import("./components/app_course/cover.comp.vue"),
          children: [
            {
              name: "appCourseCove.main",
              path: ""
            },
            {
              name: "appCourseCover.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              component: () =>
                System.import("./components/app_course/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "/app_course/item/:id",
          component: () =>
            System.import("./components/app_course/itemContent.comp.vue"),
          children: [
            {
              name: "appCourseItem.main",
              path: ""
            },
            {
              name: "appCourseItem.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              component: () =>
                System.import("./components/app_course/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "/app_course/item/:itemId/invited_by/:uid",
          name: "course.invited.main",
          component: () =>
            System.import("./components/course/shareMiddle.comp.vue")
        },
        {
          path: "/course/featured",
          name: "course.featured.main",
          component: () =>
            System.import("./components/course/featured.comp.vue")
        },
        {
          path: "/course/list",
          name: "course.list.main",
          component: () => System.import("./components/course/list.comp.vue")
        },
        {
          path: "/group/:groupId",
          component: () =>
            System.import("./components/course/container.comp.vue"),
          children: [
            {
              name: "group.main",
              path: ""
            },
            {
              name: "group.cover",
              path: "cover",
              component: () => System.import("./components/group/list.comp.vue")
            },
            {
              name: "group.publish",
              path: "publish",
              component: () =>
                System.import("./components/group/publish.comp.vue")
            }
          ]
        },
        {
          path: "/group/:groupId/:msg",
          name: "group.message.comment",
          meta: {
            title: "评论"
          },
          component: () => System.import("./components/group/comment.comp.vue")
        },
        {
          path: "/course/:courseId",
          component: () =>
            System.import("./components/course/container.comp.vue"),
          children: [
            {
              name: "course.main",
              path: ""
            },
            {
              name: "course.cover",
              path: "cover",
              component: () =>
                System.import("./components/course/cover.comp.vue")
            }
          ]
        },
        {

          path: "/course/:courseId/items/:itemId",
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard(true)];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/course/content.comp.vue"),
          children: [
            {
              name: "course.item.main",
              path: ""
            },
            {
              name: "course.item.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              component: () =>
                System.import("./components/course/post-comment.comp.vue")
            }
          ]
        },
        //新版app课程相关
        {
          path: "/app_course/cover/:id",
          component: () =>
            System.import("./components/app_course/cover.comp.vue"),
          children: [
            {
              name: "appCourseCove.main",
              path: ""
            },
            {
              name: "appCourseCover.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              component: () =>
                System.import("./components/app_course/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "/app_course/item/:id",
          component: () =>
            System.import("./components/app_course/itemContent.comp.vue"),
          children: [
            {
              name: "appCourseItem.main",
              path: ""
            },
            {
              name: "appCourseItem.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              component: () =>
                System.import("./components/app_course/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "app/app_course/item/:itemId/invited_by/:uid",
          name: "course.invited.main",
          component: () =>
            System.import("./components/app_items/course/shareMiddle.comp.vue")
        },
        {
          path: "app/course/featured",
          name: "course.featured.main",
          component: () =>
            System.import("./components/app_items/course/featured.comp.vue")
        },
        {
          path: "app/course/list",
          name: "course.list.main",
          component: () => System.import("./components/app_items/course/list.comp.vue")
        },
        {
          path: "app/course/h5_list",
          name: "course.list.main",
          component: () => System.import("./components/app_items/course/h5.list.comp.vue")
        },
        {
          path: "app/group/:groupId",
          component: () =>
            System.import("./components/app_items/course/container.comp.vue"),
          children: [
            {
              name: "group.main",
              path: ""
            },
            {
              name: "group.cover",
              path: "cover",
              component: () => System.import("./components/group/list.comp.vue")
            },
            {
              name: "group.publish",
              path: "publish",
              component: () =>
                System.import("./components/group/publish.comp.vue")
            }
          ]
        },
        {
          path: "/group/:groupId/:msg",
          name: "group.message.comment",
          meta: {
            title: "评论"
          },
          component: () => System.import("./components/group/comment.comp.vue")
        },
        {
          path: "app/course/:courseId",
          component: () =>
            System.import("./components/app_items/course/container.comp.vue"),
          children: [
            {
              name: "course.main",
              path: ""
            },
            {
              name: "course.cover",
              path: "cover",
              component: () =>
                System.import("./components/app_items/course/cover.comp.vue")
            }
          ]
        },
        {
          path: "app/course/:courseId/items/:itemId",
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard(true)];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/app_items/course/content.comp.vue"),
          children: [
            {
              name: "course.item.main",
              path: ""
            },
            {
              name: "course.item.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              component: () =>
                System.import("./components/app_items/course/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "/talks/:id",
          component: talksComp,
          children: [
            {
              name: "talks.main",
              path: ""
            },
            {
              name: "talks.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              beforeEnter(to, from, next) {
                const tasks = [authGuard(), mobileBindedGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: () =>
                System.import("./components/talks/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "/topic_post/:id",
          component: topic_post,
          children: [
            {
              name: "topic_post.main",
              path: ""
            },
            {
              name: "topic_post.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              beforeEnter(to, from, next) {
                const tasks = [authGuard(), mobileBindedGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: () =>
                System.import("./components/topic_post/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "/member/video",
          component: MemberVideoComponent,
          children: [
            {
              name: "member_video.main",
              path: ""
            }
          ]
        },
        {
          path: "/wv/pop_quiz",
          component: () =>
            System.import("./components/pop_quiz/index.comp.vue"),
          children: [
            {
              name: "pop_quiz.main",
              path: ""
            },
            {
              name: "pop_quiz.question",
              path: "question",
              component: () =>
                System.import("./components/pop_quiz/question.comp.vue")
            },
            {
              name: "pop_quiz.my",
              path: "my/:id",
              component: () =>
                System.import("./components/pop_quiz/my.comp.vue")
            },
            {
              name: "pop_quiz.rank",
              path: "rank",
              component: () =>
                System.import("./components/pop_quiz/rank.comp.vue")
            },
            {
              name: "pop_quiz.receive",
              path: "receive/:id",
              component: () =>
                System.import("./components/pop_quiz/receive-prizes.comp.vue")
            }
          ]
        },
        {
          path: "/member/activate",
          name: "member.activate",
          meta: {
            title: "激活会员"
          },
          beforeEnter(to, from, next) {
            // const tasks = [authGuard(), mobileBindedGuard(), memberActivateCompGuard()];
            const tasks = [authGuard(), mobileBindedGuard(true)];

            // const tasks = [auth4MobileGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/member/activate.comp.vue")
        },
        {
          path: "/member/intro",
          name: "member.intro",
          meta: {
            title: "造就会员"
          },
          component: () => System.import("./components/member/intro.comp.vue")
        },
        {
          path: "/member/intro-mars",
          name: "member.intro-mars",
          meta: {
            title: "造就火星会员"
          },
          component: () =>
            System.import("./components/member/intro-mars.comp.vue")
        },
        {
          path: '/wv/aia-intro-mars',
          name: 'member.aia-intro-mars',
          meta: {
            title: '友邦联名卡',
          },
          component: () => System.import('./components/member/aia-intro-mars.comp.vue'),
        },
        {
          path: '/wv/pact',
          name: 'pact.main',
          meta: {
            title: '用户协议',
          },
          component: () => System.import('./components/member/pact.comp.vue'),
        },
        {
          path: '/wv/form',
          name: 'pact.main',
          meta: {
            title: '火星联名卡登记表',
          },
          component: () => System.import('./components/member/mars-from.comp.vue'),
        },
        {
          path: '/wv/appPay-guide/:id',
          name: 'appPay.guide',
          meta: {
            title: "绑定引导"
          },
          component: () =>
            System.import("./components/appPay_guide/content.comp.vue")
        },
        {
          path: "/new-member",
          meta: {
            title: "造就新会员"
          },
          children: [
            {
              path: "",
              name: "new-member.main",
              redirect: "video"
            },
            {
              path: "card",
              name: "new-member.card",

              beforeEnter(to, from, next) {
                const tasks = [memberCardGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: marsMemberCard
            },
            {
              path: "action",
              name: "new-member.action",
              beforeEnter(to, from, next) {
                const tasks = [memberActionGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: marsMemberDiscount
            },
            {
              path: "plan",
              name: "new-member.plan",
              beforeEnter(to, from, next) {
                const tasks = [memberPlanGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: marsMemberPlanList
            },
            {
              name: "new-member.video",
              path: "video",
              component: marsMemberVideo
            },
            {
              name: "new-member.course",
              path: "course",
              component: marsMemberCourse
            },
            {
              name: "new-member.download",
              path: "download",
              component: marsMemberDownload
            }
          ],
          component: memberContainer
        },

        {
          path: "/mars-member",
          meta: {
            title: "造就火星会员"
          },
          component: marsMemberContainer,
          children: [
            {
              path: "",
              redirect: "video"
            },
            {
              path: "card",
              component: marsMemberCard
            },
            {
              path: "action",
              component: marsMemberDiscount
            },
            {
              path: "video",
              component: marsMemberVideo
            },
            {
              path: "course",
              component: marsMemberCourse
            },
            {
              path: "download",
              component: marsMemberDownload
            },
            {
              path: "plan",
              component: marsMemberPlanList
            }
          ]
        },
        {
          path: "/app-member",
          meta: {
            title: "造就火星会员"
          },
          component: appMemberContainer,
          children: [

            {
              path: "",
              name: "app-member.main",
              redirect: "video"
            },
            {
              path: "card",
              name: "app-member.card",

              beforeEnter(to, from, next) {
                const tasks = [memberCardGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: itemMarsMemberCard
            },
            {
              path: "action",
              name: "app-member.action",
              beforeEnter(to, from, next) {
                const tasks = [memberActionGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: itemMarsMemberDiscount
            },
            {
              path: "plan",
              name: "app-member.plan",
              beforeEnter(to, from, next) {
                const tasks = [memberPlanGuard()];
                execRouteTask(tasks, to, from, next);
              },
              component: itemMarsMemberPlanList
            },
            {
              name: "app-member.video",
              path: "video",
              component: itemMarsMemberVideo
            },
            {
              name: "app-member.course",
              path: "course",
              component: itemMarsMemberCourse
            },
            {
              name: "app-member.download",
              path: "download",
              component: itemMarsMemberDownload
            }

          ]
        },
        {
          path: "/wv/ios-member",
          meta: {
            title: "造就新会员"
          },
          children: [
            {
              path: "",
              redirect: "action"
            },
            {
              path: "card",
              name: "ios-member.card",
              component: memberContent
            },
            {
              path: "action",
              name: "ios-member.action",
              component: memberContent
            },
            {
              name: "ios-member.video",
              path: "video",
              component: memberContent
            },
            {
              name: "ios-member.course",
              path: "course",
              component: memberContent
            },
            {
              name: "ios-member.download",
              path: "download",
              component: memberContent
            }
          ],
          component: iosMemberContainer
        },
        {
          path: "/my",
          name: "my",
          meta: {
            title: "个人中心"
          },
          beforeEnter(to, from, next) {

            const tasks = [authGuard()];
            // debugger;
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/my/my.comp.vue")
        },
        {
          path: "/my/member",
          name: "my.member",
          meta: {
            title: "会员"
          },
          alias: "/member/info", // compatible with angular
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/my/member.comp.vue"),
          children: [
            {
              path: "rights/:id",
              meta: {
                title: "会员权益"
              },
              name: "my.member.rights",
              component: () =>
                System.import("./components/my/member-rights.comp.vue")
            }
          ]
        },
        {
          path: "/my/orders",
          name: "my.orders",
          meta: {
            title: "我的订单"
          },
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/my/order.comp.vue")
        },
        {
          path: "app/my/orders",
          name: "my.orders",
          meta: {
            title: "我的订单"
          },
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/app_items/my/order.comp.vue")
        },
        {
          path: "app/my/orders/:id",
          name: "orders",
          meta: {
            title: "订单详情"
          },
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/app_items/my/order-detail.comp.vue")
        },
        {
          path: "/my/tickets",
          name: "my.tickets",
          meta: {
            title: "我的票券"
          },
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/my/ticket.comp.vue")
        },
        {
          path: "/my/address",
          name: "my.address",
          meta: {
            title: "收货地址"
          },
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/my/address.comp.vue"),
          children: [
            {
              path: "edit/:id?",
              name: "my.address.edit",
              component: () =>
                System.import("./components/my/edit-address.comp.vue")
            }
          ]
        },
        {
          path: "/orders/:id?",
          name: "orders",
          meta: {
            title: "订单"
          },
          beforeEnter(to, from, next) {
            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () => System.import("./components/order/order.comp.vue")
        },


        {
          path: "/events",
          name: "event",
          meta: {
            title: "现场"
          },
          component: () => System.import("./components/event/list.comp.vue")
        },
        {
          path: "/events/:id/tickets",
          name: "event.ticket",
          meta: {
            title: "购票"
          },
          component: () => System.import("./components/event/ticket.comp.vue")
        },
        {
          path: "app/events",
          name: "event",
          meta: {
            title: "现场"
          },
          component: () => System.import("./components/app_items/event/list.comp.vue")
        },
        {
          path: "app/events/:id/tickets",
          name: "event.ticket",
          meta: {
            title: "购票"
          },
          component: () => System.import("./components/app_items/event/ticket.comp.vue")
        },
        {
          path: "app/events/:id/tickets/purchase",
          name: "event.ticket",
          meta: {
            title: "购票详情"
          },
          component: () => System.import("./components/app_items/event/ticket-purchase.comp.vue")
        },
        {
          path: "app/order/pay/:id",
          name: "event.ticket",
          meta: {
            title: "支付订单"
          },
          component: () => System.import("./components/app_items/order/order.comp.vue")
        },
        {
          path: "/columns",
          name: "column",
          meta: {
            title: "专栏"
          },
          component: () => System.import("./components/columns/list.comp.vue")
        },
        {
          path: "/columns/:id",
          name: "column.cover",
          component: () => System.import("./components/columns/cover.comp.vue")
        },
        {
          path: "/columns/:id/items/:itemId",
          beforeEnter(to, from, next) {

            const tasks = [authGuard(), mobileBindedGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>

            System.import("./components/columns/content.comp.vue"),
          children: [
            {
              name: "column.item.main",
              path: ""
            },
            {
              name: "column.item.post-comment",
              path: "post-comment",
              meta: {
                title: "发表评论"
              },
              component: () =>
                System.import("./components/columns/post-comment.comp.vue")
            }
          ]
        },
        {
          path: "/wv/wiee",
          component: () => System.import("./components/wiee/banner.comp.vue"),
          children: [
            {
              path: "",
              name: "wiee.banner",
              meta: {
                title: "造就思想节"
              }
            },
            {
              path: "index",
              name: "wiee.main",
              meta: {
                title: "造就思想节"
              },
              component: () => System.import("./components/wiee/index.comp.vue")
            },
            {
              path: "index/en",
              name: "wiee.main.en",
              meta: {
                title: "造就思想节"
              },
              component: () =>
                System.import("./components/wiee/index.en.comp.vue")
            },
            {
              path: "guests/:id",
              meta: {
                title: "嘉宾详情"
              },
              component: () =>
                System.import("./components/wiee/guests/main.comp.vue")
            },
            {
              path: "detail",
              name: "wiee.detail",
              meta: {
                title: "WIEE"
              },
              component: () =>
                System.import("./components/wiee/detail/main.comp.vue")
            },
            {
              path: "navigation",
              component: () =>
                System.import("./components/wiee/map/main.comp.vue"),
              children: [
                {
                  path: "",
                  name: "wiee.map",
                  meta: {
                    title: "WIEE大会 地图"
                  }
                },
                {
                  path: ":id",
                  name: "wiee.map.detail",
                  meta: {
                    title: "WIEE大会 地图"
                  },
                  component: () =>
                    System.import("./components/wiee/map/detail.comp.vue")
                }
              ]
            },
            {
              path: "group/:groupId",
              component: () =>
                System.import("./components/wiee/group/list.comp.vue"),
              children: [
                {
                  path: "",
                  meta: {
                    title: "造就思想节交流圈"
                  },
                  name: "wiee.group.main"
                },
                {
                  path: "publish",
                  name: "wiee.group.publish",
                  meta: {
                    title: "发布"
                  },
                  component: () =>
                    System.import("./components/wiee/group/publish.comp.vue")
                },
                {
                  path: "msg",
                  name: "wiee.group.message.comment",
                  meta: {
                    title: "评论"
                  },
                  component: () =>
                    System.import("./components/wiee/group/comment.comp.vue")
                }
              ]
            },
            {
              path: "desc",
              component: () =>
                System.import("./components/wiee/desc/main.comp.vue")
            }
          ]
        },
        {
          path: "/wv/reservation",
          component: () =>
            System.import("./components/h5/reservation/reservation.comp.vue"),
          children: [
            {
              path: "",
              name: "预约嘉宾"
            },
            {
              path: ":id",
              name: "反馈",
              component: () =>
                System.import("./components/h5/reservation/success.comp.vue")
            }
          ]
        },
        {
          path: "x/intro-mars",
          component: () =>
            System.import("./components/h5/mars-member/mars.comp.vue"),
          children: [
            {
              path: "",
              name: "mars",
              meta: {
                title: "火星会员"
              }
            },
            {
              path: "success",
              name: "mars.success",
              meta: {
                title: "开通成功"
              },
              component: () =>
                System.import("./components/h5/mars-member/success.comp.vue")
            }
          ]
        },
        {
          path: "/wv/zaojiu-renwen",
          component: () =>
            System.import("./components/h5/zj-renwen/main.comp.vue"),
          children: [
            {
              path: "",
              name: "zaojiu.renwen",
              meta: {
                title: "造就人文"
              }
            }
          ]
        },
        {
          path: "/wv/future",
          component: () =>
            System.import("./components/h5/future-meeting/index.comp.vue"),
          children: [
            {
              path: "",
              name: "zaojiu.future",
              meta: {
                title: "2018造就FUTURE年度大会"
              }
            }
          ]
        },
        {
          path: "/book/poster/:id",
          component: () =>
            System.import("./components/dis_book/poster.comp.vue"),
          children: [
            {
              path: "",
              name: "zaojiu.book",
              meta: {
                title: "听书海报"
              }
            }
          ]
        },
        {
          path: "/book/detail/:id",
          component: () =>
            System.import("./components/dis_book/detail.comp.vue"),
          children: [
            {
              path: "",
              name: "zaojiu.book",
              meta: {
                title: "听书详情"
              }
            }
          ]
        },
        {
          path: "/items/video/:id",
          meta: {
            title: "视频"
          },
          component: () =>
            System.import("./components/app_items/video/video.comp.vue"),

        },
        {
          path: "/items/videoTxt/:id",
          meta: {
            title: "视频介绍"
          },
          component: () =>
            System.import("./components/app_items/video/video-txt.comp.vue"),

        },
        {
          path: "/items/videoT/:id",
          meta: {
            title: "视频介绍"
          },
          component: () =>
            System.import("./components/app_items/video/video-t.comp.vue"),

        },
        {
          path: "/items/smallVideo/:id",
          meta: {
            title: "短视频"
          },
          component: () =>
            System.import("./components/app_items/video/smallVideo.comp.vue"),

        },
        {
          path: "app/book/detail/:id",
          component: () =>
            System.import("./components/app_items/book/detail.comp.vue"),
          children: [
            {
              path: "",
              name: "new.book",
              meta: {
                title: "听书海报"
              }
            }
          ]
        },
        {
          path: "app/book/poster/:id",
          component: () =>
            System.import("./components/app_items/book/poster.comp.vue"),
          children: [
            {
              path: "",
              name: "new.poster",
              meta: {
                title: "听书详情"
              }
            }
          ]
        },
        {
          path: "/500",
          name: "error",
          component: errorComp
        },
        {
          path: "/app/userAd/:id",
          name: "notfound",
          meta: {
            title: "讲者主页"
          },
          component: () =>
            System.import("./components/app_items/userAd/home.comp.vue")
        },
        {
          path: "/app/labelAd/:id",
          name: "notfound",
          meta: {
            title: "标签主页"
          },
          component: () =>
            System.import("./components/app_items/userAd/label.comp.vue")
        },
        {
          path: "/app/see",
          name: "notfound",
          meta: {
            title: "我看过的"
          },
          beforeEnter(to, from, next) {

            const tasks = [authGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/app_items/my/see.comp.vue")
        },
        {
          path: "/app/like",
          name: "notfound",
          meta: {
            title: "我喜欢的"
          },
          beforeEnter(to, from, next) {

            const tasks = [authGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/app_items/my/like.comp.vue")
        },
        {
          path: "/app/card",
          name: "notfound",
          meta: {
            title: "我的卡包"
          },
          beforeEnter(to, from, next) {

            const tasks = [authGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/app_items/my/card.comp.vue")
        },
        {
          path: "/app/order/card",
          name: "notfound",
          meta: {
            title: "选取优惠券"
          },
          beforeEnter(to, from, next) {

            const tasks = [authGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/app_items/order/card-order.comp.vue")
        },
        {
          path: "/app/follow",
          name: "notfound",
          meta: {
            title: "我的关注"
          },
          beforeEnter(to, from, next) {

            const tasks = [authGuard()];
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/app_items/my/follow.comp.vue")
        },
        {
          path: "/app/collection",
          name: "notfound",
          meta: {
            title: "我收藏的"
          },
          beforeEnter(to, from, next) {

            const tasks = [authGuard()];
            // debugger;
            execRouteTask(tasks, to, from, next);
          },
          component: () =>
            System.import("./components/app_items/my/collection.comp.vue")
        },
        {
          path: "/404",
          name: "notfound",
          component: () =>
            System.import("./components/notfound/notfound.comp.vue")
        },
        {
          path: "*",
          component: () =>
            System.import("./components/notfound/notfound.comp.vue")
        }
      ]
    }
  ]
});

export let preRoute: Route;

router.afterEach((to, from) => {
  preRoute = from;

  if (afterHooks.length) {
    afterHooks.forEach(hook => hook(to, from));
  }
});

router.beforeEach((to, from, next) => {

  if (beforeHooks.length) {
    beforeHooks.forEach(hook => hook(to, from, next));
  } else {
    next();
  }
});
