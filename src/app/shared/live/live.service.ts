import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { LiveInfoModel } from './live.model';
import { UserInfoModel } from '../user-info/user-info.model';
import { AppConfig } from '../../app.config';
import { StoreService } from '../store/store.service';
import { LiveStatus } from './live.enums'

@Injectable()
export class LiveService {
  private mockUrl: string = '../../../assets/mock-data/live-room-info.json';
  constructor (private http: Http, private config: AppConfig, private store: StoreService) {}

  parseLiveInfo(data: any): LiveInfoModel {
    let liveInfo = new LiveInfoModel;
    liveInfo.id = data.id;
    liveInfo.subject = data.subject;
    liveInfo.desc = data.desc;
    liveInfo.kind = data.kind;
    liveInfo.owner = data.users[data.owner] as UserInfoModel;
    liveInfo.admin = data.users[data.admin] as UserInfoModel;
    for (let uid of data.editors) {
      let user = data.users[uid];
      liveInfo.editors = liveInfo.editors || [];
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
    console.log(id);
    const url = `${this.config.urlPrefix.io}/api/streams/${id}/close`;
    return this.http.patch(url, null).toPromise().then(res => {
      let data = res.json();

      return data;
    });
  }
}
