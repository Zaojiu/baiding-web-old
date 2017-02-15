import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {LiveService} from "../api/live/live.service";
import {LiveInfoModel} from "../api/live/live.model";
import {UserInfoModel} from "../api/user-info/user-info.model";
import {LiveRoomComponent} from "../../live-room/live-room.component";
import {UtilsService} from "../utils/utils";
import {IosBridgeService} from "../ios-bridge/ios-bridge.service";
import {LiveType} from "../api/live/live.enums";
import {AuthBridge} from "../bridge/auth.interface";

@Injectable()
export class AppJumperGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService,
              private liveService: LiveService, private iosBridge: IosBridgeService,
              private router: Router, private authService: AuthBridge) {
  }

  private gotoLive(liveId: string, route: ActivatedRouteSnapshot, state: RouterStateSnapshot, needPush: boolean): Promise<boolean> {
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
        this.iosBridge.pushH5State(route, state);
        return false;
      }

      return true;
    }, () => {
      return false;
    });
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
      return this.gotoLive(liveId, route, state, needPush);
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

