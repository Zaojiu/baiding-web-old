import {host} from '../../env/environment';
import {TalkInfoModel, TalkCommentModel, TalkEmphasisModel} from './talk.model';
import {params} from '../utils/utils';
import {del, get, post} from "./xhr";

export const getTalkInfo = async (id: string) => {
  const url = `${host.io}/api/live/objects/${id}`;
  const res = await get(url).catch(() => null);
  if (res === null) return null;
  return new TalkInfoModel(res.data.object, res.data.users, res.data.speakers, res.data.categories, res.data.tags, res.data.currentUserInfo)
};

export const listTalkComments = async (id: string, size = 20, marker = '', sorts = ['-createdAt']): Promise<TalkCommentModel[]> => {
  const query = {
    createdAt: marker,
    size: size,
    sorts: sorts.join(',')
  };
  const url = `${host.io}/api/live/objects/${id}/comments?${params(query)}`;
  const res = await get(url);
  const result = res.data.result;
  const users = res.data.include ? res.data.include.users : null;
  const comments = [];

  if (!result || !result.length) return [];

  for (let item of result) {
    comments.push(new TalkCommentModel(item, users))
  }

  return comments;
};

export const postTalkComment = (id: string, content: string, parentId?: string) => {
  const data = {
    content,
    parentId
  };

  const url = `${host.io}/api/live/objects/${id}/comments`;
  return post(url, data);
};

export const favorite = (id: string) => {
  const url = `${host.io}/api/live/my/favorited/objects/${id}`;
  return post(url, null);
};

export const unfavorite = (id: string) => {
  const url = `${host.io}/api/live/my/favorited/objects/${id}`;
  return del(url);
};

export const praise = (id: string) => {
  const url = `${host.io}/api/live/my/praised/objects/${id}`;
  return post(url, null);
};

export const unpraise = (id: string) => {
  const url = `${host.io}/api/live/my/praised/objects/${id}`;
  return del(url);
};

export const getTalkEmphasis = async (id: string): Promise<TalkEmphasisModel[]> => {
  const url = `${host.io}/api/live/media/${id}/cues?size=1000`;
  const res = await get(url).catch(() => null);
  if (!res) return [];

  const resultParsed: TalkEmphasisModel[] = [];
  const result = res.data.result;
  if (result && Array.isArray(result)) {
    result.forEach(item => {
      const itemParsed = new TalkEmphasisModel(item.id, item.mediaId, item.start, item.duration, item.text, item.coverUrl, item.createdAt);
      resultParsed.push(itemParsed);
    });
  }

  return resultParsed;
};
