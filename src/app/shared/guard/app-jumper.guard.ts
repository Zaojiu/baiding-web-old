import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {LiveService} from "../api/live/live.service";
import {LiveInfoModel} from "../api/live/live.model";
import {UserInfoModel} from "../api/user-info/user-info.model";
import {LiveRoomComponent} from "../../+live-room/live-room.component";
import {UtilsService} from "../utils/utils";
import {IosBridgeService} from "../ios-bridge/ios-bridge.service";
import {AuthBridge} from "../bridge/auth.interface";
import {ArticleComponent} from "../../+talk/article/article.component";
import {TalkService} from "../api/talk/talk.api";
import {StoreService} from "../store/store.service";
import {MyListModel} from "../api/my/my.model";
import {ResourceType} from "../api/resource-type.enums";
import {NotFoundComponent} from "../../+notfound/notfound.component";
import {OperationTipsService} from "../operation-tips/operation-tips.service";
import {ReloadComponent} from "../../+reload/reload.component";

@Injectable()
export class AppJumperGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService,
              private liveService: LiveService, private talkService: TalkService,
              private iosBridge: IosBridgeService, private router: Router,
              private authService: AuthBridge, private toolTips: OperationTipsService) {
  }

  private gotoLive(liveId: string, state: RouterStateSnapshot, needPush: boolean): Promise<boolean> {
    return this.processLiveInfo(liveId, state).then(liveInfo => {
      const userInfo = this.userInfoService.getUserInfoCache(state.url);

      if (!liveInfo || !userInfo) return false;

      // app视频直播, 使用app的gotoLive
      if (liveInfo.isTypeApp() && liveInfo.isEditor(userInfo.uid)) {
        let role = liveInfo.isAdmin(userInfo.uid) ? 'admin' : liveInfo.isVip(userInfo.uid) ? 'vip' : 'audience';
        this.iosBridge.gotoLive(liveInfo.id, liveInfo.kind, role);
        return false;
      }

      // 文字直播间, 如果在app中, 使用app的gotoRoom, 在其他浏览器正常跳转
      if (UtilsService.isInApp && needPush) {
        let model = this.getObjectInfoCache(liveId);

        if (!model) {
          model = {
            id: liveInfo.id,
            type: ResourceType.Live,
            subject: liveInfo.subject,
            desc: liveInfo.desc,
            coverUrl: liveInfo.coverUrl,
            coverSmallUrl: liveInfo.coverSmallUrl,
            coverThumbnailUrl: liveInfo.coverThumbnailUrl,
            isNeedPay: liveInfo.isNeedPay,
            totalFee: liveInfo.totalFee,
            publishAt: moment(+liveInfo.createdAt),
          } as MyListModel;
        }

        this.iosBridge.gotoRoom(liveId, model);
        return false;
      }

      return true;
    }, () => {
      return false;
    });
  }

  private gotoTalk(talkId: string, needPush: boolean): Promise<boolean> {
    // 文章, 如果在app中, 使用app的gotoRoom, 在其他浏览器正常跳转
    let goto = (data: MyListModel, resolve) => {
      if (UtilsService.isInApp && needPush) {
        this.iosBridge.gotoRoom(talkId, data);
        resolve(false);
      } else {
        resolve(true);
      }
    };

    return new Promise((resolve, reject) => {
      let cache = this.getObjectInfoCache(talkId);
      if (cache) {
        goto(cache, resolve);
      } else {
        this.talkService.getTalkInfo(talkId).then(talkInfo => {
          let model = {
            id: talkInfo.id,
            type: ResourceType.Talk,
            subject: talkInfo.subject,
            desc: talkInfo.desc,
            coverUrl: talkInfo.coverUrl,
            coverSmallUrl: talkInfo.coverSmallUrl,
            coverThumbnailUrl: talkInfo.coverThumbnailUrl,
            isNeedPay: talkInfo.isNeedPay,
            totalFee: talkInfo.totalFee,
            publishAt: talkInfo.publishAt,
          } as MyListModel;
          goto(model, resolve);
        }, (err) => {
          if (err.status === 404) {
            this.router.navigate([`/404`]);
          } else if (err.status !== 401) {
            this.toolTips.popup('获取数据错误, 请重试');
          }
          resolve(false);
        });
      }
    });
  }

  private getObjectInfoCache(objectId: string): MyListModel {
    let objectCache = StoreService.get('objectCache');

    if (objectCache && objectCache[objectId]) {
      return objectCache[objectId] as MyListModel;
    }

    return null;
  }

  private processLiveInfo(liveId: string, state: RouterStateSnapshot): Promise<LiveInfoModel> {
    let liveInfoCache = this.liveService.getLiveInfoCache(liveId);

    if (liveInfoCache) {
      return Promise.resolve(liveInfoCache);
    } else {
      return this.liveService.getLiveInfo(liveId).then(liveInfo => {
        return liveInfo;
      }, (err) => {
        const to = `${location.protocol}//${location.hostname}${state.url}`;
        if (err.status === 404) {
          this.router.navigate([`/404`]);
        } else {
          this.router.navigate([`/reload`], {queryParams: {redirectTo: to}});
        }
        return null;
      });
    }
  }

  private getRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    if (!route.component) {
      let parent = route.parent;

      while (parent) {
        if (parent.component) {
          route = parent;
          break;
        }

        parent = parent.parent;
      }
    }

    return route;
  }

  private isRouteChildren(parentComp: any, childComp: any): boolean {
    if (!parentComp || !childComp) return false;

    let parentConfig: Route = null;

    this.router.config.forEach((root) => {
      let queue = [root];

      while (queue.length > 0) {
        let route = queue.pop();

        // 找到父路由在路由树种的配置
        if (route.component === parentComp) {
          parentConfig = route;
          break;
        }

        let children = route.children;
        if (route['_loadedConfig'] && route['_loadedConfig'].routes && route['_loadedConfig'].routes.length) {
          children = route['_loadedConfig'].routes;
        }

        if (!children) continue;

        queue.push(...children);
      }
    });

    if (parentConfig) {
      let queue = [parentConfig];

      while (queue.length > 0) {
        let routeConfig = queue.pop();

        // 在父路由中找到子路由, 关系确认, 返回, 否则继续遍历查找其他子元素
        if (routeConfig.component === childComp) return true;

        let children = routeConfig.children;
        if (routeConfig['_loadedConfig'] && routeConfig['_loadedConfig'].routes && routeConfig['_loadedConfig'].routes.length) {
          children = routeConfig['_loadedConfig'].routes;
        }

        if (!children) continue;

        queue.push(...children);
      }
    }

    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let preRoute = this.router.routerState.root.snapshot;
    while (preRoute.firstChild) preRoute = preRoute.firstChild;
    preRoute = this.getRoute(preRoute);
    let currentRoute = this.getRoute(route);

    // 已经有过第一次导航(非新开), 并且下一个路由非同一个页面(同个component内的跳转不push, 避免重定向一次追加参数, 又会再次push)
    let needRedirect = preRoute.component !== currentRoute.component && this.router.navigated;
    let isPop = this.isRouteChildren(currentRoute.component, preRoute.component);

    // 如果有回退, 并且在app中, 优先使用popH5State
    if (isPop && UtilsService.isInApp && needRedirect) {
      this.iosBridge.popH5State(currentRoute, state);
      return Promise.resolve(false);
      // 否则检测是否是直播间
    } else if (currentRoute.component === LiveRoomComponent) {
      let liveId = route.params['id'];
      return this.gotoLive(liveId, state, needRedirect);
      // 再检测是否是文章
    } else if (currentRoute.component === ArticleComponent) {
      let talkId = route.params['id'];
      return this.gotoTalk(talkId, needRedirect);
      // 如果是app中404或reload页面, 则不pushstate
    } else if (currentRoute.component === NotFoundComponent || currentRoute.component === ReloadComponent && UtilsService.isInApp) {
      return Promise.resolve(true);
    } else if (UtilsService.isInApp && needRedirect) {
      // 其他路由, 如果在app中, 使用app的pushH5State
      this.iosBridge.pushH5State(currentRoute, state);
      return Promise.resolve(false);
    } else {
      // 其他情况, 在其他浏览器正常跳转
      return Promise.resolve(true);
    }
  }
}

