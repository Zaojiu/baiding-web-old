import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {LiveService} from '../api/live/live.service';
import {UserInfoService} from "../api/user-info/user-info.service";
import {TalkService} from "../api/talk/talk.api";

@Injectable()
export class LiveRoomTitleResolver implements Resolve<string> {
  constructor(private liveService: LiveService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    let liveId = route.params['id'];

    if (!liveId) {
      let parent = route.parent;
      while (parent) {
        liveId = parent.params['id'];
        if (liveId) break;
        parent = parent.parent;
      }

      if (!liveId) return Promise.resolve('');
    }

    return this.liveService.getLiveInfo(liveId).then(liveInfo => {
      return liveInfo.subject;
    }, () => {
      return '';
    });
  }
}

@Injectable()
export class TalkTitleResolver implements Resolve<string> {
  constructor(private talkService: TalkService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    let talkId = route.params['id'];

    if (!talkId) {
      let parent = route.parent;
      while (parent) {
        talkId = parent.params['id'];
        if (talkId) break;
        parent = parent.parent;
      }

      if (!talkId) return Promise.resolve('');
    }

    return this.talkService.getTalkInfo(talkId).then(talkInfo => {
      return talkInfo.subject;
    }, () => {
      return '';
    });
  }
}

@Injectable()
export class UserNickResolver implements Resolve<string> {
  constructor(private userInfoService: UserInfoService) {
  }

  resolve(): Promise<string> {
    return this.userInfoService.getUserInfo(false, true).then(userInfo => {
      return userInfo.nick;
    }, () => {
      return '';
    });
  }
}
