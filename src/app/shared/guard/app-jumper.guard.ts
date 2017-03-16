import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

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

@Injectable()
export class AppJumperGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService,
              private liveService: LiveService, private talkService: TalkService,
              private iosBridge: IosBridgeService, private router: Router, private authService: AuthBridge) {
  }

  private gotoLive(liveId: string, state: RouterStateSnapshot, needPush: boolean): Promise<boolean> {
    return Promise.all<UserInfoModel, LiveInfoModel>([this.processUserInfo(state), this.processLiveInfo(liveId)]).then(result => {
      let userInfo = result[0];
      let liveInfo = result[1];

      if (liveInfo.isTypeApp() && liveInfo.isEditor(userInfo.uid)) {
        let role = liveInfo.isAdmin(userInfo.uid) ? 'admin' : liveInfo.isVip(userInfo.uid) ? 'vip' : 'audience';
        this.iosBridge.gotoLive(liveInfo.id, liveInfo.kind, role);
        return false;
      }

      // 文字直播间, 如果在app中, 使用app的pushState, 在其他浏览器正常跳转
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
    let goto = (data: MyListModel, resolve) => {
      if (UtilsService.isInApp && needPush) {
        this.iosBridge.gotoRoom(talkId, data);
        resolve(false);
      }

      resolve(true);
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
        }, () => {
          this.router.navigate([`404`]);
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

  private processLiveInfo(liveId: string): Promise<LiveInfoModel> {
    let liveInfoCache = this.liveService.getLiveInfoCache(liveId);

    if (liveInfoCache) {
      return Promise.resolve(liveInfoCache);
    } else {
      return this.liveService.getLiveInfo(liveId).then(liveInfo => {
        return liveInfo;
      }, () => {
        this.router.navigate([`404`]);
        return null;
      });
    }
  }

  private processUserInfo(state: RouterStateSnapshot): Promise<UserInfoModel> {
    let to = `${location.protocol}//${location.hostname}${state.url}`;
    let userInfoCache = this.userInfoService.getUserInfoCache();

    if (userInfoCache) {
      return Promise.resolve(userInfoCache);
    } else {
      return this.userInfoService.getUserInfo().then(userInfo => {
        return Promise.resolve(userInfo);
      }, () => {
        this.authService.auth(encodeURIComponent(to));
        return null;
      });
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let preRoute = this.router.routerState.root;
    while (preRoute.firstChild) preRoute = preRoute.firstChild;
    // 已经有过第一次导航(非新开), 并且下一个路由非同一个页面(同个component内的跳转不push, 避免重定向一次追加参数, 又会再次push)
    let needPush = preRoute.component !== route.component && this.router.navigated;

    if (route.component === LiveRoomComponent) {
      let liveId = route.params['id'];
      return this.gotoLive(liveId, state, needPush);
    } else if (route.parent.component === ArticleComponent) {
      let talkId = route.params['id'];
      return this.gotoTalk(talkId, needPush);
    } else {
      // 其他路由, 如果在app中, 使用app的pushState, 在其他浏览器正常跳转
      if (UtilsService.isInApp && needPush) {
        this.iosBridge.pushH5State(route, state);
        return Promise.resolve(false);
      } else {
        return Promise.resolve(true);
      }
    }
  }
}

