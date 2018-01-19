import {host} from '../../env/environment';
import {params} from '../utils/utils';
import {get} from './xhr';

export class MemberVideoModel {
  title = '';
  coverUrl: string;
  duration: any;
  name = '';
  speakerCompany = '';
  desc = '';
  speakerTitle = '';
  tag = '';
  id = '';

  constructor(item: any, include: any) {
    this.coverUrl = `${item.coverUrl}~16-9`;
    this.title = item.subject;
    let seconds = moment.duration(item.meta.duration).seconds();
    let minutes = moment.duration(item.meta.duration).minutes();
    this.duration = `${minutes}'${seconds}''`;
    if (item.tags && item.tags[0]) {
      this.tag = `#${item.tags[0]}`;
    }
    this.id = item.id || '';
    if (item.meta.speakersId && item.meta.speakersId[0]) {
      let speakerDetail = include[item.meta.speakersId[0]];
      this.speakerCompany = speakerDetail.speaker_meta.company;
      this.speakerTitle = speakerDetail.speaker_meta.title;
      this.name = speakerDetail.subject;
    }
  }
}

export class MemberListModel {
  list: any;
  marker: string;

  constructor(list: any, marker = '') {
    this.list = list;
    this.marker = marker;
  }
}


export const getMemberVideoList = async (marker?: string): Promise<MemberListModel> => {
  let url = `${host.io}/api/live/media/member`;
  if (marker) {
    const query = {
      marker: marker
    };
    url = `${host.io}/api/live/media/member?${params(query)}`;
  }
  const resp = await get(url);
  const data = resp.data;

  const result = data.result;
  const include = data.include ? data.include.speakers : null;
  const comments = [] as any;

  if (!result || !result.length) {
    return new MemberListModel(comments, '');
  }

  for (let item of result) {
    comments.push(new MemberVideoModel(item, include));
  }

  return new MemberListModel(comments, data.include.markerStr);
};
