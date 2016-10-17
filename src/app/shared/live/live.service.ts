import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {LiveInfoModel} from './live.model';
import {UserInfoModel} from '../user-info/user-info.model';
import {AppConfig} from '../../app.config';
import {StoreService} from '../store/store.service';
import {LiveStatus} from './live.enums';
import {UserInfoService} from '../user-info/user-info.service';

@Injectable()
export class LiveService {
  constructor(private http: Http, private config: AppConfig, private store: StoreService, private userInfoService: UserInfoService) {
  }

  isEditor(id: string): boolean {
    let userInfo = this.userInfoService.getUserInfoCache();
    let liveInfo = this.getLiveInfoCache(id);

    if (!userInfo || !liveInfo || !liveInfo.admin) return false;

    var isEditor = false;

    if (userInfo.uid === liveInfo.admin.uid) isEditor = true;
    for (let editor of liveInfo.editors) {
      if (userInfo.uid === editor.uid) isEditor = true;
    }

    return isEditor;
  }

  isAudience(id: string): boolean {
    return !this.isEditor(id);
  }

  isAdmin(id: string): boolean {
    let userInfo = this.userInfoService.getUserInfoCache();
    let liveInfo = this.getLiveInfoCache(id);

    if (!userInfo || !liveInfo || !liveInfo.admin) return false;

    return userInfo.uid === liveInfo.admin.uid;
  }

  setLiveRoomAlreadyVisited() {
    this.store.set('hasEntered', true);
  };

  getLiveRoomAlreadyVisited(): boolean {
    let enterLiveRoom = this.store.get('hasEntered') || false;
    return enterLiveRoom;
  }

  parseLiveInfo(data: any): LiveInfoModel {

    let liveInfo = new LiveInfoModel;

    let stream = data.stream;
    let users = data.users;
    let currentStreamUser = data.currentStreamUser;

    liveInfo.id = stream.id;
    liveInfo.subject = stream.subject;
    liveInfo.desc = stream.desc;
    liveInfo.coverUrl = stream.coverUrl;
    liveInfo.kind = stream.kind;

    liveInfo.owner = users[stream.owner] as UserInfoModel;
    liveInfo.admin = users[stream.admin] as UserInfoModel;
    liveInfo.editors = [];
    for (let uid of stream.editors) {
      let user = users[uid];
      if (!user) {
        continue
      }
      liveInfo.editors.push(user);
    }

    liveInfo.expectStartAt = stream.expectStartAt;
    liveInfo.expectDuration = stream.expectDuration;
    liveInfo.startedAt = stream.startedAt;
    liveInfo.closedAt = stream.closedAt;
    liveInfo.createdAt = stream.createdAt;
    liveInfo.isDraft = stream.isDraft;

    if (stream.status === 'created') liveInfo.status = LiveStatus.Created;
    if (stream.status === 'canceled') liveInfo.status = LiveStatus.Canceled;
    if (stream.status === 'started') liveInfo.status = LiveStatus.Started;
    if (stream.status === 'closed') liveInfo.status = LiveStatus.Ended;

    liveInfo.praised = stream.praised;
    liveInfo.commented = stream.commented;
    liveInfo.niced = stream.niced;
    liveInfo.shared = stream.shared;
    liveInfo.lcConvId = stream.lcConvId;
    liveInfo.hadPraised = currentStreamUser && currentStreamUser.praised;

    if (data.onlines) liveInfo.onlines = data.onlines;

    return liveInfo
  }

  getLiveInfoCache(id: string): LiveInfoModel {
    let lives = this.store.get('lives') || {};
    return lives[id] as LiveInfoModel;
  }

  getLiveInfo(id: string, needRefresh?: boolean): Promise<LiveInfoModel> {
    let lives = this.store.get('lives') || {};
    let liveInfoCache = lives[id];
    if (liveInfoCache && !needRefresh) return Promise.resolve(liveInfoCache);

    const url = `${this.config.urlPrefix.io}/api/live/streams/${id}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let liveInfo = this.parseLiveInfo(data);
      lives[liveInfo.id] = liveInfo;
      this.store.set('lives', lives);

      return liveInfo;
    }, () => {
      return Promise.reject(liveInfoCache)
    })
    // .catch();
  }

  closeLive(id: string): Promise<any> {
    const url = `${this.config.urlPrefix.io}/api/live/streams/${id}/close`;
    return this.http.put(url, null).toPromise().then(res => {
      let data = res.json();

      return data;
    });
  }

  praiseLive(id: string, praised: boolean, emoji: string = '👍'): Promise<any> {
    const url = `${this.config.urlPrefix.io}/api/live/streams/${id}/praises`;

    let data = {
      praised: praised,
      num: 0,
      emoji: emoji,
    };

    return this.http.post(url, JSON.stringify(data)).toPromise().then(res => {
      let data = res.json();

      return data;
    });
  }
}
