import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {LiveInfoModel, UploadCoverTokenModel} from './live.model';
import {UserInfoModel} from '../user-info/user-info.model';
import {StoreService} from '../../store/store.service';
import {LiveStatus, LiveType, LiveStreamStatus} from './live.enums';
import {environment} from "../../../../environments/environment";
import {VideoPlayerSrc, LiveStreamInfo} from "../../../live-room/video-player/video-player.model";
import {UtilsService} from "../../utils/utils";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class LiveService {
  constructor(private http: Http, private sanitizer: DomSanitizer) {
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
    liveInfo.coverUrl = `${stream.coverUrl}?updatedAt=${Math.round(+liveInfo.updatedAt)}`;

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

    liveInfo.coverSmallUrl = stream.coverUrl ? `${stream.coverUrl}?imageMogr2/auto-orient/thumbnail/640x/gravity/Center/crop/640x300&updatedAt=${Math.round(+liveInfo.updatedAt)}` : '/assets/img/default-cover.jpg';
    liveInfo.coverThumbnailUrl = stream.coverUrl ? `${stream.coverUrl}?imageMogr2/auto-orient/thumbnail/60x/gravity/Center/crop/60x&updatedAt=${Math.round(+liveInfo.updatedAt)}` : '/assets/img/default-cover.jpg';

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

  processStreamInfo(liveInfo: LiveInfoModel): Promise<LiveStreamInfo> {
    if (!liveInfo.isTypeVideo()) return Promise.resolve(null);

    let hlsPromise = !liveInfo.isClosed() ? this.getStreamPullingAddr(liveInfo.id) : null;
    // 直播已开始, 并且推过流
    let playbackPromise = !liveInfo.isCreated() && liveInfo.isStreamDone() ? this.getPlaybackAddr(liveInfo.id) : null;

    return Promise.all([hlsPromise, playbackPromise]).then(result => {
      let streamInfo = result[0];
      let playbackInfo = result[1];
      return Object.assign({}, streamInfo, playbackInfo);
    });
 }

  getStreamPullingAddr(id: string): Promise<LiveStreamInfo> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/live/urls/hls|rtmp`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let streamAddr = data ? UtilsService.isDesktopChrome ? data.rtmp : data.hls : '';
      let streamSrc = [new VideoPlayerSrc(this.sanitizer.bypassSecurityTrustUrl(streamAddr), UtilsService.isDesktopChrome ? 'rtmp/mp4' : 'application/x-mpegURL')];
      let streamInfo = new LiveStreamInfo();

      streamInfo.streamSrc = streamSrc;

      return streamInfo;
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

  getPlaybackAddr(id: string): Promise<LiveStreamInfo> {
    const url = `${environment.config.host.io}/api/live/streams/${id}/live/urls/playback`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let playbackAddr = data && data.SD_mp4 ? [new VideoPlayerSrc(data.SD_mp4, 'video/mp4')] : data.m3u8 ? [new VideoPlayerSrc(data.m3u8, 'application/x-mpegURL')] : [];
      let streamInfo = new LiveStreamInfo();

      streamInfo.playbackSrc = playbackAddr;

      return streamInfo;
    });
  }
}
