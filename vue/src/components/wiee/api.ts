import {host} from '../../env/environment';
import {get} from '../../shared/api/xhr';
import {params} from '../../shared/utils/utils';
import {LiveInfoModel} from "../../shared/api/lives.model";


export const getSpeakerInfo = async (id: string): Promise<any> => {
  const url = `${host.io}/api/live/objects/${id}`;
  const res = await get(url);
  const data = res.data;
  return data;
};

export const getSpeakerMedia = async (id: string): Promise<SpeakerMedia[]> => {
  const url = `${host.io}/api/live/media?${params({speakersId: id, size: 20})}`;
  const res = await get(url);
  const data = res.data;
  let media: SpeakerMedia[] = [];
  data.result.forEach((item: any) => {
    media.push(new SpeakerMedia(item, data.include));
  });
  return media;
};

export const getSpeakerTalk = async (id: string): Promise<SpeakerMedia[]> => {
  const url = `${host.io}/api/live/talks?${params({speakersId: id, size: 20})}`;
  const res = await get(url);
  const data = res.data;
  let talks: SpeakerMedia[] = [];
  data.result.forEach((item: any) => {
    talks.push(new SpeakerMedia(item, data.include));
  });
  return talks;
};

export class SpeakerMedia {
  id: string;
  subject: string;
  coverUrl: string;
  duration: Duration;
  tag: string;
  title: string;
  speakersId: string;

  constructor(data: any, include: any) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.subject = data.subject;
    this.coverUrl = data.coverUrl ? `${data.coverUrl}~16-9` : '/assets/img/default-cover.jpg';
    this.speakersId = (data.speakersId && data.speakersId[0]) ? data.speakersId[0] : '';
    this.tag = (data.tags && data.tags[0]) ? data.tags[0] : '';

    this.title = (
      include.speakers &&
      include.speakers[this.speakersId] &&
      include.speakers[this.speakersId].speaker_meta &&
      include.speakers[this.speakersId].speaker_meta.title) ?
      include.speakers[this.speakersId].speaker_meta.title : '';
    this.duration = data.duration ? moment.duration(data.duration) : moment.duration(0);
  }
}


export const listNow = async (markerId?: string, size = 20): Promise<LiveInfoModel[]> => {
  const query: { [key: string]: any } = {size};
  if (markerId) query.marker = markerId;

  const url = `${host.io}/api/live/term/wiee/streams?${params(query)}`;
  let resp;
  try {
    resp = await get(url);
  } catch (e) {
    return [];
  }

  const data = resp.data || {};
  const livesData = data.result ? data.result : [];
  const usersData = data.include && data.include.users ? data.include.users : {};
  const lives: LiveInfoModel[] = [];

  for (let liveInfo of livesData) {
    lives.push(new LiveInfoModel(liveInfo, usersData));
  }

  return lives;
};
