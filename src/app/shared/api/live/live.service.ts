import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {LiveInfoModel, UploadCoverTokenModel} from './live.model';
import {UserInfoModel} from '../user-info/user-info.model';
import {StoreService} from '../../store/store.service';
import {LiveStatus} from './live.enums';
import {UserInfoService} from '../user-info/user-info.service';
import {Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {UtilsService} from "../../utils/utils";

@Injectable()
export class LiveService {
  tranlationExpandedSource = new Subject<boolean>();
  $tranlationExpanded = this.tranlationExpandedSource.asObservable();

  constructor(private http: Http, private store: StoreService, private userInfoService: UserInfoService, private utilsService: UtilsService) {
  }

  isEditor(liveId: string, uid?: number): boolean {
    let userInfo = this.userInfoService.getUserInfoCache();
    let liveInfo = this.getLiveInfoCache(liveId);

    if (!userInfo || !liveInfo || !liveInfo.admin) return false;

    var isEditor = false;
    let _uid = uid ? uid : userInfo.uid;

    if (_uid === liveInfo.admin.uid) isEditor = true;
    for (let editor of liveInfo.editors) {
      if (_uid === editor.uid) isEditor = true;
    }

    return isEditor;
  }

  isAudience(liveId: string, uid?: number): boolean {
    return !this.isEditor(liveId, uid);
  }

  isAdmin(liveId: string, uid?: number): boolean {
    let userInfo = this.userInfoService.getUserInfoCache();
    let liveInfo = this.getLiveInfoCache(liveId);
    let _uid = uid ? uid : userInfo.uid;

    if (!userInfo || !liveInfo || !liveInfo.admin) return false;

    return _uid === liveInfo.admin.uid;
  }

  setTextWordsStashed(text: string, liveId: string) {
    let textStashed = UtilsService.getStorage('textStashed');
    textStashed[liveId] = text;
    UtilsService.setStorage('textStashed', textStashed);
  };

  getTextWordsStashed(liveId: string): string {
    return UtilsService.getStorage('textStashed')[liveId] || '';
  }

  setLiveRoomAlreadyVisited() {
    this.store.set('hasEntered', true);
  };

  getLiveRoomAlreadyVisited(): boolean {
    let enterLiveRoom = this.store.get('hasEntered') || false;
    return enterLiveRoom;
  }

  parseLiveInfo(stream: any, users: any, currentStreamUser?: any): LiveInfoModel {

    let liveInfo = new LiveInfoModel;

    liveInfo.id = stream.id;
    liveInfo.subject = stream.subject;
    liveInfo.desc = stream.desc;
    liveInfo.coverUrl = stream.coverUrl;
    liveInfo.kind = stream.kind;

    liveInfo.owner = users[stream.owner] as UserInfoModel;
    liveInfo.admin = users[stream.admin] as UserInfoModel;

    liveInfo.editors = [];
    if (stream.editors) {
      stream.editors.forEach(function (uid) {
        let user = users[uid];
        if (user) {
          liveInfo.editors.push(user);
        }
      });
    }

    liveInfo.latestUsers = [];
    if (stream.latestUserUids) {
      stream.latestUserUids.forEach(function (uid) {
        let user = users[uid];
        if (user) {
          liveInfo.latestUsers.push(user);
        }
      });
    }

    liveInfo.expectStartAt = stream.expectStartAt;
    liveInfo.expectDuration = stream.expectDuration;
    liveInfo.startedAt = stream.startedAt;
    liveInfo.closedAt = stream.closedAt;
    liveInfo.createdAt = (+stream.createdAt / 1e6).toString();
    liveInfo.updatedAt = (+stream.updatedAt / 1e6).toString();
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

    liveInfo.totalUsers = stream.totalUsers;

    if (stream.coverUrl) liveInfo.coverSmallUrl = `${stream.coverUrl}?imageView2/2/w/1500/interlace/1/q/70&updatedAt=${liveInfo.updatedAt}`;

    return liveInfo;
  }

  getLiveInfoCache(id: string): LiveInfoModel {
    let lives = this.store.get('lives') || {};
    return lives[id] as LiveInfoModel;
  }

  getLiveInfo(id: string, needRefresh?: boolean): Promise<LiveInfoModel> {
    let lives = this.store.get('lives') || {};
    let liveInfoCache = lives[id];
    if (liveInfoCache && !needRefresh) return Promise.resolve(liveInfoCache);

    const url = `${environment.config.host.io}/api/live/streams/${id}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let liveInfo = this.parseLiveInfo(data.stream, data.users, data.currentStreamUser);
      lives[liveInfo.id] = liveInfo;
      this.store.set('lives', lives);

      return liveInfo;
    }, () => {
      return Promise.reject(liveInfoCache);
    })
    // .catch();
  }

  createLive(subject: string, coverUrl: string, desc: string, expectStartAt: string, kind = 'text'): Promise<string> {
    let data: { [key: string]: string } = {
      subject: subject,
      desc: desc,
      coverUrl: coverUrl,
      expectStartAt: expectStartAt,
      kind: kind,
    };

    const url = `${environment.config.host.io}/api/live/streams`;
    return this.http.post(url, data).toPromise().then(res => {
      let data = res.json();

      return data.id;
    });
  }

  updateLiveInfo(id: string, title: string, desc: string, expectStartAt: string, coverKey?: string): Promise<void> {
    let data: { [key: string]: string } = {
      subject: title,
      desc: desc,
      expectStartAt: expectStartAt,
    };

    if (coverKey) data['coverKey'] = coverKey;

    const url = `${environment.config.host.io}/api/live/streams/${id}`;
    return this.http.put(url, data).toPromise().then(res => {
      return;
    });
  }

  closeLive(id: string): Promise<any> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/close`;
    return this.http.put(url, null).toPromise().then(res => {
      let data = res.json();

      return data;
    });
  }

  praiseLive(id: string, praised: boolean, emoji: string = '👍'): Promise<any> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/praises`;

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

  listLiveInfo(uid: number, marker = '', size = 20, sorts = ['-createdAt']): Promise<LiveInfoModel[]> {
    let query = {
      createdAt: marker,
      size: size,
      sorts: sorts.join(','),
    };
    const url = `${environment.config.host.io}/api/live/streams/owner/${uid}?${$.param(query)}`;
    return this.http.get(url).toPromise().then((res) => {
      let data = res.json();

      let streamData = data.result;
      let usersData = data.include.users;
      let liveInfoList: LiveInfoModel[] = [];

      for (let liveInfo of streamData) {
        let liveInfoParsed = this.parseLiveInfo(liveInfo, usersData);
        liveInfoList.push(liveInfoParsed);
      }
      return liveInfoList;
    });
  }

  listLiveAudience(id: string): Promise<UserInfoModel[]> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/users`;
    return this.http.get(url).toPromise().then((res) => {
      let data = res.json();

      if (!data || !data.include) return [];

      let usersData = data.include.users;
      let audienceList: UserInfoModel[] = [];
      let count = 0;
      for (let audience in usersData) {
        let audienceParsed = this.parseLiveAudienceInfo(usersData[audience]);
        audienceList.push(audienceParsed);
        count++;
        // 最多取五条观众数据
        if (count >= 4) break;
      }
      return audienceList;
    });
  }

  parseLiveAudienceInfo(data: any): UserInfoModel {
    let info = new UserInfoModel();
    info.nick = data.nick;
    info.avatar = data.avatar;
    info.uid = data.uid;
    return info;
  }


  banComment(id: string, uid: number): Promise<void> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/users/${uid}/silence`;

    return this.http.post(url, null).toPromise().then(() => {
      return;
    });
  }

  getCoverUploadToken(id: string): Promise<UploadCoverTokenModel> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/cover/uptoken`;

    return this.http.post(url, null).toPromise().then((res) => {
      let data = res.json();

      let model = new UploadCoverTokenModel(data.key, data.token);

      return model;
    });
  }

  toggleAudioAutoPlay(liveId: string) {
    let audioAutoPlay = UtilsService.getStorage('audioAutoPlay');
    audioAutoPlay[liveId] = !audioAutoPlay[liveId];
    UtilsService.setStorage('audioAutoPlay', audioAutoPlay);
  }

  isAudioAutoPlay(liveId: string): boolean {
    return !!UtilsService.getStorage('audioAutoPlay')[liveId];
  }

  toggleTranslationExpanded(liveId: string) {
    let expanded = UtilsService.getStorage('tranlastion');
    expanded[liveId] = !expanded[liveId];
    UtilsService.setStorage('tranlastion', expanded);

    this.tranlationExpandedSource.next(expanded[liveId]);
  }

  isTranslationExpanded(liveId: string): boolean {
    return !!UtilsService.getStorage('tranlastion')[liveId];
  }

  confirmShare(id: string): Promise<void> {
    let url = `${environment.config.host.io}/api/live/streams/${id}/share`;

    return this.http.post(url, null).toPromise().then(res => {
      return;
    });
  }
}
