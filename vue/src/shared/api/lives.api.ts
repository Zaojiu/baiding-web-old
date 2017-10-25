import {LiveInfoModel, LivePublishedStatus, LiveRoomPresentModel, ShareRankingModel} from "./lives.model";
import {host} from "../../env/environment";
import {isChrome, isInWechat, isWindowsWechat, params} from "../utils/utils";
import {del, get, post, put} from "./xhr";
import {Store} from "../utils/store";
import {eventPraise, ObjectType, TargetInfo} from "../utils/analytics";
import {VideoInfo} from "./video.model";

const cacheLiveInfo = (id: string, liveInfo: LiveInfoModel) => {
  const liveInfoCache: {[key: string]: LiveInfoModel} = Store.localStore.get('liveInfo') || {};
  liveInfoCache[id] = liveInfo;
  Store.localStore.set('liveInfo', liveInfoCache);
};

export const getLiveInfo = async (id: string, join = false): Promise<LiveInfoModel> => {
  const query = {join};
  const url = `${host.io}/api/live/streams/${id}?${params(query)}`;
  const resp = await get(url);
  const data = resp.data;
  const liveInfo = new LiveInfoModel(data.stream, data.users, data.currentStreamUser);

  cacheLiveInfo(id, liveInfo);

  return liveInfo;
};

export const refreshLiveInfo = (liveId: string): Promise<LiveInfoModel> => {
  return getLiveInfo(liveId, false);
};

export const getLiveInfoCache = (id: string): LiveInfoModel|null => {
  const lives = Store.get('lives');

  if (lives) {
    const liveInfo = lives[id];

    if (liveInfo) {
      return liveInfo;
    }
  }

  return null;
};

export const listLiveInfo = async (uid: number, marker = '', size = 20, sorts = ['-createdAt']): Promise<LiveInfoModel[]> => {
  const query = {
    createdAt: marker,
    size: size,
    sorts: sorts.join(','),
    status: LivePublishedStatus.Published //默认显示已经发布的内容
  };
  const url = `${host.io}/api/live/streams/owner/${uid}?${params(query)}`;
  const resp = await get(url);
  const data = resp.data;
  const livesData = data.result;
  const lives: LiveInfoModel[] = [];

  if (livesData) {
    const usersData = data.include.users;
    for (let liveInfo of livesData) {
      lives.push(new LiveInfoModel(liveInfo, usersData));
    }
  }

  return lives;
};

export const createLive = async (subject: string, coverUrl: string, desc: string, expectStartAt: string, kind: string): Promise<string> => {
  const body = {
    subject,
    desc,
    coverUrl,
    expectStartAt,
    kind,
  };
  const url = `${host.io}/api/live/streams`;
  const resp = await post(url, body);
  const data = resp.data;
  return data.id;
};

export const updateLive = async (id: string, title: string, desc: string, expectStartAt: string, coverKey?: string, coverWeixinId?: string): Promise<LiveInfoModel> => {
  const body: {[key:string]: string} = {
    title,
    desc,
    expectStartAt,
  };

  if (coverKey) body['coverKey'] = coverKey;
  if (coverWeixinId) body['coverWeixinId'] = coverWeixinId;

  const url = `${host.io}/api/live/streams/${id}`;
  await put(url, body);
  return refreshLiveInfo(id);
};

export const closeLive = async (id: string): Promise<LiveInfoModel> => {
  const url = `${host.io}/api/live/streams/${id}/close`;
  await put(url);
  return refreshLiveInfo(id);
};

export const praiseLive = async (id: string, praised: boolean, emoji: string = '👍'): Promise<LiveInfoModel> => {
  const url = `${host.io}/api/live/streams/${id}/praises`;
  const body = {
    praised,
    num: 0,
    emoji,
  };

  const target = new TargetInfo(id, ObjectType.stream);
  eventPraise(target);

  await post(url, body);
  return refreshLiveInfo(id);
};

export const listBookedLiveInfo = async (lastId = '', size = 20): Promise<LiveInfoModel[]> => {
  const query = {
    lastId,
    size,
  };
  const url = `${host.io}/api/live/streams/booked?${params(query)}`;
  const resp = await get(url);
  const data = resp.data;
  const livesData = data.result;
  const lives: LiveInfoModel[] = [];

  if (livesData) {
    const usersData = data.include.users;
    for (let liveInfo of livesData) {
      lives.push(new LiveInfoModel(liveInfo, usersData));
    }
  }

  return lives;
};

export const listNow = async (markerId: string, size = 20): Promise<LiveInfoModel[]> => {
  const query = {
    size,
    marker: markerId,
  };
  const url = `${host.io}/api/live/now/streams?${params(query)}`;
  const resp = await get(url);
  const data = resp.data;
  const livesData = data.result;
  const lives: LiveInfoModel[] = [];

  if (livesData) {
    const usersData = data.include.users;

    for (let liveInfo of livesData) {
      lives.push(new LiveInfoModel(liveInfo, usersData));
    }
  }

  return lives;
};

export const bookLive = async (id: string): Promise<LiveInfoModel> =>  {
  const url = `${host.io}/api/live/streams/${id}/book`;
  await post(url);
  return refreshLiveInfo(id);
};

export const unbookLive = async (id: string): Promise<LiveInfoModel> => {
  const url = `${host.io}/api/live/streams/${id}/book`;
  await del(url);
  return refreshLiveInfo(id);
};

export const banComment = async (id: string, uid: number): Promise<void> => {
  const url = `${host.io}/api/live/streams/${id}/users/${uid}/silence`;
  await post(url);
  return;
};

export const getStreamPullingAddr = async (id: string): Promise<VideoInfo> => {
  const url = `${host.io}/api/live/streams/${id}/live/urls/hls|rtmp`;
  const resp = await get(url);
  const data = resp.data;
  return new VideoInfo(data.hls, '', '', '', data.rtmp_sd, data.rtmp_hd, data.rtmp);
};

export const getStreamPushingAddr = async (id: string): Promise<string[]> => {
  const url = `${host.io}/api/live/streams/${id}/live/urls/publish`;

  const resp = await get(url);
  const data = resp.data;
  const pushAddr = data ? data.publish : '';

  return [pushAddr];
};

export const getPlaybackAddr = async (id: string): Promise<VideoInfo> => {
  const url = `${host.io}/api/live/streams/${id}/live/urls/playback`;
  const resp = await get(url);
  const data = resp.data;
  let m3u8 = '', mp4 = '', mp4SD = '', mp4HD = '';

  if (data) {
    m3u8 = data.m3u8 || '';
    mp4 = data._mp4 || '';
    mp4SD = data.SD_mp4 || '';
    mp4HD = data.HD_mp4 || '';
  }

  return new VideoInfo(m3u8, mp4SD, mp4HD, mp4);
};

export const processStreamInfo = async (liveInfo: LiveInfoModel): Promise<VideoInfo> => {
  if (!liveInfo.isTypeVideo) return Promise.resolve(new VideoInfo);

  let promise = null;

  if (liveInfo.isCreated) {
    if (liveInfo.isStreamPushing) {
      promise = getStreamPullingAddr(liveInfo.id);
    } else {
      return Promise.resolve(new VideoInfo);
    }
  } else if (liveInfo.isStarted) {
    if (liveInfo.isStreamNone) return Promise.resolve(new VideoInfo);

    if (liveInfo.isStreamPushing) promise = getStreamPullingAddr(liveInfo.id);

    if (liveInfo.isStreamDone) promise = getPlaybackAddr(liveInfo.id);
  } else if (liveInfo.isClosed) {
    promise = getPlaybackAddr(liveInfo.id);
  }

  if (promise) {
    const videoInfo = await promise;

    if (videoInfo) {
      if ((isChrome && !isInWechat) || isWindowsWechat) {
        videoInfo.m3u8 = '';
      } else {
        videoInfo.rtmpSD = '';
        videoInfo.rtmpHD = '';
        videoInfo.rtmp = '';
      }
    }

    return videoInfo;
  }

  return Promise.resolve(new VideoInfo);
};

export const getSubscribeLink = async (id: string): Promise<string> => {
  const url = `${host.io}/api/live/streams/${id}/qrcode`;
  const resp = await get(url);
  const data = resp.data;
  const ticket = data && data.ticket ? data.ticket : '';

  if (ticket === '') throw new Error('empty subscribe ticket');

  return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`;
};

export const getShareRanking = async (id: string): Promise<ShareRankingModel[]> => {
  const url = `${host.io}/api/live/streams/${id}/users/share/ranking`;
  const resp = await get(url);
  const data = resp.data;
  const result = data && data.result ? data.result : [];
  const resultParsed: ShareRankingModel[] = [];

  for (let item of result) {
    resultParsed.push(new ShareRankingModel(item));
  }

  return resultParsed;
};

export const getMyShareCard = async (id: string): Promise<string> => {
  const url = `${host.io}/api/live/streams/${id}/share/card/my`;
  const resp = await get(url);
  const data = resp.data;
  return data && data.src ? data.src : '';
};

export const presents = async (liveId: string, fromUid: number): Promise<LiveRoomPresentModel> => {
  const url = `${host.io}/api/live/objects/${liveId}/presents?from=${fromUid}`;

  const resp = await get(url);
  const data = resp.data;
  return new LiveRoomPresentModel(data);
};

export const receivePresents = async (liveId: string, fromUid: number): Promise<void> => {
  const url = `${host.io}/api/live/objects/${liveId}/presents`;
  const data = {
    from: fromUid,
  };
  await post(url, data);
};
