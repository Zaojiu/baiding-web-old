import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { LiveInfoModel } from './live.model';
import { UserInfoModel } from '../user-info/user-info.model';
import { AppConfig } from '../../app.config';
import { StoreService } from '../store/store.service';
import { LiveStatus } from './live.enums';
import { UserInfoService } from '../user-info/user-info.service';

@Injectable()
export class LiveService {
  constructor (private http: Http, private config: AppConfig, private store: StoreService, private userInfoService: UserInfoService) {}

  isEditor(id: string) {
    let userInfo = this.userInfoService.getUserInfoCache();
    let liveInfo = this.getLiveInfoCache(id);

    if (!userInfo || !liveInfo) return false;

    var isEditor = false;

    if (userInfo.uid === liveInfo.admin.uid) isEditor = true;
    for (let editor of liveInfo.editors) {
      if (userInfo.uid === editor.uid) isEditor = true;
    }

    return isEditor;
  }

  isAudience(id: string) {
    return !this.isEditor(id);
  }

  parseLiveInfo(data: any): LiveInfoModel {
    let liveInfo = new LiveInfoModel;
    liveInfo.id = data.id;
    liveInfo.subject = data.subject;
    liveInfo.desc = data.desc;
    liveInfo.kind = data.kind;
    liveInfo.owner = data.users[data.owner] as UserInfoModel;
    liveInfo.admin = data.users[data.admin] as UserInfoModel;
    liveInfo.editors = [];
    for (let uid of data.editors) {
      let user = data.users[uid];
      liveInfo.editors.push(user);
    }
    liveInfo.expectStartAt = data.expectStartAt;
    liveInfo.expectDuration = data.expectDuration;
    liveInfo.startedAt = data.startedAt;
    liveInfo.closedAt = data.closedAt;
    liveInfo.createdAt = data.createdAt;
    liveInfo.isDraft = data.isDraft;
    if (data.status === 'created') liveInfo.status = LiveStatus.Created;
    if (data.status === 'canceled') liveInfo.status = LiveStatus.Canceled;
    if (data.status === 'started') liveInfo.status = LiveStatus.Started;
    if (data.status === 'closed') liveInfo.status = LiveStatus.Ended;
    liveInfo.praised = data.praised;
    liveInfo.lcConvId = data.lcConvId;

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

    const url = `${this.config.urlPrefix.io}/api/streams/${id}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let liveInfo = this.parseLiveInfo(data);

      lives[liveInfo.id] = liveInfo;
      this.store.set('lives', lives);

      return liveInfo;
    });
      // .catch(this.handleError);
  }

  closeLive(id: string): Promise<any> {
    const url = `${this.config.urlPrefix.io}/api/streams/${id}/close`;
    return this.http.patch(url, null).toPromise().then(res => {
      let data = res.json();

      return data;
    });
  }
}
