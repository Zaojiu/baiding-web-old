import {host} from '../../env/environment';
import {params} from '../utils/utils';
import {get} from './xhr';

export class DownloadResourcesModel {
  title = '';
  id = '';
  downloadUrl = '';
  coverUrl = '';

  constructor(item: any) {
    this.title = item.subject || '';
    this.downloadUrl = item.downloadUrl;
    this.id = item.id || '';
    if (item.speaker && item.speaker.subject && item.object && item.object.subject) {
      this.title = `${item.speaker.subject}:${item.object.subject}`;
    }
    if (item.object && item.object.coverUrl) {
      this.coverUrl = `${item.object.coverUrl}~1-1`;
    }
  }
}

export class DownloadResourcesListModel {
  list: any;
  marker: string;

  constructor(list: any, marker = '') {
    this.list = list;
    this.marker = marker;
  }
}


export const getDownloadResourcesList = async (marker?: string): Promise<DownloadResourcesListModel> => {
  const query = {
    marker: marker,
    size: 10
  };
  const url = `${host.io}/api/live/attachments?${params(query)}`;
  const resp = await get(url);
  const data = resp.data;

  const result = data.result;
  const thisMarker = (data.include && data.include.markerStr) ? data.include.markerStr : '';
  const comments = [] as any;

  if (!result || !result.length) {
    return new DownloadResourcesListModel(comments, '');
  }

  for (let item of result) {
    comments.push(new DownloadResourcesModel(item));
  }

  return new DownloadResourcesListModel(comments, thisMarker);
};
