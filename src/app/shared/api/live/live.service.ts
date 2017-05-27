import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {LiveInfoModel, UploadCoverTokenModel} from './live.model';
import {UserInfoModel} from '../user-info/user-info.model';
import {StoreService} from '../../store/store.service';
import {LiveStatus, LiveType, LiveStreamStatus} from './live.enums';
import {environment} from "../../../../environments/environment";
import {UtilsService} from "../../utils/utils";
import {VideoInfo} from "../../video-player/video-player.model";

import { AnalyticsService, TargetInfo, ObjectType } from "../../analytics/analytics.service"

@Injectable()
export class LiveService {
  constructor(private http: Http, private analytics: AnalyticsService) {
  }

  private refreshLiveInfo(liveId: string): Promise<LiveInfoModel> {
    return this.getLiveInfo(liveId, true, false).then((liveInfo) => {
      return liveInfo;
    });
  }

  parseLiveInfo(stream: any, users: any, currentStreamUser?: any): LiveInfoModel {
    let liveInfo = new LiveInfoModel;

    liveInfo.id = stream.id;
    liveInfo.subject = stream.subject;
    liveInfo.desc = stream.desc;

    switch (stream.meta.kind) {
      case 'text':
        liveInfo.kind = LiveType.Text;
        break;
      case 'video':
        liveInfo.kind = LiveType.Video;
        break;
      case 'app':
        liveInfo.kind = LiveType.App;
        break;
      default:
        liveInfo.kind = LiveType.Text;
    }

    liveInfo.owner = users[stream.uid] as UserInfoModel;
    liveInfo.admin = users[stream.meta.admin] as UserInfoModel;

    liveInfo.editors = [];
    if (stream.meta.editors) {
      stream.meta.editors.forEach(function (uid) {
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

    liveInfo.expectStartAt = stream.meta.expectStartAt;
    liveInfo.expectDuration = stream.meta.expectDuration;
    liveInfo.startedAt = stream.meta.startedAt;
    liveInfo.closedAt = stream.meta.closedAt;
    liveInfo.createdAt = (+stream.createdAt / 1e6).toString();
    liveInfo.updatedAt = (+stream.updatedAt / 1e6).toString();
    liveInfo.isDraft = stream.isDraft;

    // TODO: need to fix live cover ratio, maybe?
    liveInfo.coverUrl = encodeURI(`${stream.coverUrl}?updatedAt=${Math.round(+liveInfo.updatedAt)}`);
    liveInfo.coverSmallUrl = encodeURI(stream.coverUrl ? `${stream.coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1/strip&updatedAt=${Math.round(+liveInfo.updatedAt)}` : '/assets/img/default-cover.jpg');
    liveInfo.coverThumbnailUrl = encodeURI(stream.coverUrl ? `${stream.coverUrl}?imageMogr2/auto-orient/thumbnail/!120x120r/gravity/Center/crop/120x120/strip&updatedAt=${Math.round(+liveInfo.updatedAt)}` : `${environment.config.host.self}/assets/img/zaojiu-logo.jpg`);

    liveInfo.cover169Url = encodeURI(`${stream.coverUrl}~16-9?updatedAt=${Math.round(+liveInfo.updatedAt)}`);
    liveInfo.coverSmall169Url = encodeURI(stream.coverUrl ? `${stream.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1/strip&updatedAt=${Math.round(+liveInfo.updatedAt)}` : `${environment.config.host.self}/assets/img/default-cover.jpg`);
    liveInfo.coverThumbnail169Url = encodeURI(stream.coverUrl ? `${stream.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/!120x120r/gravity/Center/crop/120x120/strip&updatedAt=${Math.round(+liveInfo.updatedAt)}` : `${environment.config.host.self}/assets/img/zaojiu-logo.jpg`);

    liveInfo.cover11Url = encodeURI(`${stream.coverUrl}~1-1?updatedAt=${Math.round(+liveInfo.updatedAt)}`);
    liveInfo.coverSmall11Url = encodeURI(stream.coverUrl ? `${stream.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1/strip&updatedAt=${Math.round(+liveInfo.updatedAt)}` : `${environment.config.host.self}/assets/img/default-cover.jpg`);
    liveInfo.coverThumbnail11Url = encodeURI(stream.coverUrl ? `${stream.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/!120x120r/gravity/Center/crop/120x120/strip&updatedAt=${Math.round(+liveInfo.updatedAt)}` : `${environment.config.host.self}/assets/img/zaojiu-logo.jpg`);

    if (stream.meta.status === 'created') liveInfo.status = LiveStatus.Created;
    if (stream.meta.status === 'canceled') liveInfo.status = LiveStatus.Canceled;
    if (stream.meta.status === 'started') liveInfo.status = LiveStatus.Started;
    if (stream.meta.status === 'closed') liveInfo.status = LiveStatus.Ended;

    liveInfo.praised = stream.praised;
    liveInfo.isNeedPay = stream.isNeedPay;
    liveInfo.totalFee = stream.totalFee;
    liveInfo.commented = stream.commented;
    liveInfo.niced = stream.niced;
    liveInfo.shared = stream.shared;
    liveInfo.lcConvId = stream.lcConvId;
    liveInfo.hadPraised = currentStreamUser && currentStreamUser.praised;
    liveInfo.booked = currentStreamUser && currentStreamUser.booked;
    liveInfo.paid = currentStreamUser && currentStreamUser.paid;

    liveInfo.totalUsers = stream.totalUsers;

    if (liveInfo.isTypeVideo()) {
      switch (stream.meta.publishStatus) {
        case '':
          liveInfo.streamStatus = LiveStreamStatus.None;
          break;
        case 'publish':
          liveInfo.streamStatus = LiveStreamStatus.Pushing;
          break;
        case 'publish_done':
          liveInfo.streamStatus = LiveStreamStatus.Done;
          break;
        default:
          liveInfo.streamStatus = LiveStreamStatus.None;
      }
    }

    let lives = StoreService.get('lives') || {};
    lives[liveInfo.id] = liveInfo;
    StoreService.set('lives', lives);

    return liveInfo;
  }

  getLiveInfo(id: string, needRefresh?: boolean, join = false): Promise<LiveInfoModel> {
    let lives = StoreService.get('lives') || {};
    let liveInfoCache = lives[id];
    if (liveInfoCache && !needRefresh && !join) return Promise.resolve(liveInfoCache);

    let query = {
      join: join,
    };

    const url = `${environment.config.host.io}/api/live/streams/${id}?${$.param(query)}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let liveInfo = this.parseLiveInfo(data.stream, data.users, data.currentStreamUser);

      return liveInfo;
    });
  }

  getLiveInfoCache(id: string): LiveInfoModel {
    let lives = StoreService.get('lives') || {};
    return lives[id];
  }

  createLive(subject: string, coverUrl: string, desc: string, expectStartAt: string, kind: string): Promise<string> {
    let data: {[key: string]: string} = {
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

  updateLiveInfo(id: string, title: string, desc: string, expectStartAt: string, coverKey?: string, coverWeixinId?: string): Promise<LiveInfoModel> {
    let data: {[key: string]: string} = {
      subject: title,
      desc: desc,
      expectStartAt: expectStartAt,
    };

    if (coverKey) data['coverKey'] = coverKey;
    if (coverWeixinId) data['coverWeixinId'] = coverWeixinId;

    const url = `${environment.config.host.io}/api/live/streams/${id}`;
    return this.http.put(url, data).toPromise().then(res => {
      return this.refreshLiveInfo(id);
    });
  }

  closeLive(id: string): Promise<LiveInfoModel> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/close`;
    return this.http.put(url, null).toPromise().then(res => {
      return this.refreshLiveInfo(id);
    });
  }

  praiseLive(id: string, praised: boolean, emoji: string = '👍'): Promise<LiveInfoModel> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/praises`;

    let data = {
      praised: praised,
      num: 0,
      emoji: emoji,
    };

    var target = new TargetInfo()
    target.targetId = id
    target.targetType = ObjectType.stream
    this.analytics.eventPraise(target)

    return this.http.post(url, JSON.stringify(data)).toPromise().then(res => {
      return this.refreshLiveInfo(id);
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
      let liveInfoList: LiveInfoModel[] = [];

      if (streamData) {
        let usersData = data.include.users;
        for (let liveInfo of streamData) {
          let liveInfoParsed = this.parseLiveInfo(liveInfo, usersData);
          liveInfoList.push(liveInfoParsed);
        }
      }

      return liveInfoList;
    });
  }

  listBookedLiveInfo(markerId = '', size = 20) {
    let query = {
      lastId: markerId,
      size: size,
    };
    const url = `${environment.config.host.io}/api/live/streams/booked?${$.param(query)}`;
    return this.http.get(url).toPromise().then((res) => {
      let data = res.json();

      let streamData = data.result;
      let liveInfoList: LiveInfoModel[] = [];

      if (streamData) {
        let usersData = data.include.users;
        for (let liveInfo of streamData) {
          let liveInfoParsed = this.parseLiveInfo(liveInfo, usersData);
          liveInfoList.push(liveInfoParsed);
        }
      }

      return liveInfoList;
    });
  }

  listRecommendLiveInfo(markerId: string, size = 20): Promise<LiveInfoModel[]> {
    let query = {
      lastId: markerId,
      size: size,
    };
    const url = `${environment.config.host.io}/api/live/streams/recommend?${$.param(query)}`;
    return this.http.get(url).toPromise().then((res) => {
      let data = res.json();

      let streamData = data.result;
      let liveInfoList: LiveInfoModel[] = [];

      if (streamData) {
        let usersData = data.include.users;
        for (let liveInfo of streamData) {
          let liveInfoParsed = this.parseLiveInfo(liveInfo, usersData);
          liveInfoList.push(liveInfoParsed);
        }
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

  bookLive(liveId: string): Promise<LiveInfoModel> {
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/book`;
    return this.http.post(url, null).toPromise().then((res) => {
      return this.refreshLiveInfo(liveId);
    });
  }

  unbookLive(liveId: string): Promise<LiveInfoModel> {
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/book`;
    return this.http.delete(url).toPromise().then((res) => {
      return this.refreshLiveInfo(liveId);
    });
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

  confirmShare(id: string): Promise<void> {
    let url = `${environment.config.host.io}/api/live/streams/${id}/share`;

    return this.http.post(url, null).toPromise().then(res => {
      return;
    });
  }

  getHistoryLiveInfo(id: string): LiveInfoModel {
    let historyLiveInfo = StoreService.get('historyLiveInfo');
    if (historyLiveInfo && historyLiveInfo[id]) return historyLiveInfo[id];
    return null
  }

  processStreamInfo(liveInfo: LiveInfoModel): Promise<VideoInfo> {
    if (!liveInfo.isTypeVideo()) return Promise.resolve(new VideoInfo);

    let promise = null;

    if (liveInfo.isCreated()) {
      if (liveInfo.isStreamPushing()){
        promise = this.getStreamPullingAddr(liveInfo.id);
      } else {
        return Promise.resolve(new VideoInfo);
      }
    } else if (liveInfo.isStarted()) {
      if (liveInfo.isStreamNone()) return Promise.resolve(new VideoInfo);

      if (liveInfo.isStreamPushing()) promise = this.getStreamPullingAddr(liveInfo.id);

      if (liveInfo.isStreamDone()) promise = this.getPlaybackAddr(liveInfo.id);
    } else if (liveInfo.isClosed()) {
      promise = this.getPlaybackAddr(liveInfo.id);
    }

    return promise.then(videoInfo => {
      if (videoInfo) {
        if (UtilsService.isChrome && !UtilsService.isInWechat) {
          videoInfo.m3u8 = '';
        } else {
          videoInfo.rtmpSD = '';
          videoInfo.rtmpHD = '';
          videoInfo.rtmp = '';
        }
      }
      return videoInfo;
    });
 }

  getStreamPullingAddr(id: string): Promise<VideoInfo> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/live/urls/hls|rtmp`;

    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      return new VideoInfo(data.hls, '', '', '', data.rtmp_sd, data.rtmp_hd, data.rtmp);
    });
  }

  getStreamPushingAddr(id: string): Promise<string[]> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/live/urls/publish`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let pushAddr = data ? data.publish : '';

      return [pushAddr];
    });
  }

  getPlaybackAddr(id: string): Promise<VideoInfo> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/live/urls/playback`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let m3u8 = '', mp4 = '', mp4SD = '', mp4HD = '';

      if (data) {
        m3u8 = data.m3u8 || '';
        mp4 = data._mp4 || '';
        mp4SD = data.SD_mp4 || '';
        mp4HD = data.HD_mp4 || '';
      }

      return new VideoInfo(m3u8, mp4SD, mp4HD, mp4);
    });
  }
}
