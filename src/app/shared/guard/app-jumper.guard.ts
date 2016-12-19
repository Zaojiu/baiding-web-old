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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let preRoute = this.router.routerState.root;
    while (preRoute.firstChild) preRoute = preRoute.firstChild;
    // 已经有过第一次导航(非新开), 并且下一个路由非同一个页面(同个component内的跳转不push, 避免重定向一次追加参数, 又会再次push)
    let needPush = preRoute.component !== route.component && this.router.navigated;

    if (route.component === LiveRoomComponent) {
      let liveId = route.params['id'];
      let userInfo: UserInfoModel = null;
      let to = `${location.protocol}//${location.hostname}/#${state.url}`;

      return this.userInfoService.getUserInfo().then(_userInfo => {
        userInfo = _userInfo;
        return this.liveService.getLiveInfo(liveId);
      }, () => {
        this.authService.auth(encodeURIComponent(to));
        return null;
      }).then(liveInfo => {
        if (!liveInfo) return false; // 防止上一条错误返回null

        // 视频直播间需要跳转app
        if (
          liveInfo.kind !== LiveType.Text &&
          (liveInfo.isEditor(userInfo.uid) ||
          liveInfo.isAudience(userInfo.uid)) // 之后有h5视频端之后, 去掉此项
        ) {
          let role = liveInfo.isAdmin(userInfo.uid) ? 'admin' : liveInfo.isVip(userInfo.uid) ? 'vip' : 'audience';
          this.iosBridge.gotoLive(liveInfo.id, liveInfo.kind, role);
          return false;
        }

        // 文字直播间, 如果在app中, 使用app的pushState, 在其他浏览器正常跳转
        if (UtilsService.isInApp && needPush) {
          this.iosBridge.pushH5State(route, state);
          return false;
        } else {
          return true;
        }
      }, () => {
        this.router.navigate(['/404']);
        return false;
      });

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

