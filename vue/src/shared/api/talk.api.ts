import {host} from '../../env/environment';
import {TalkInfoModel, TalkCommentModel, TalkEmphasisModel} from './talk.model';
import {params} from '../utils/utils';
import {del, get, post} from "./xhr";
import {AxiosResponse} from "axios";

export const getTalkInfo = async (id: string) => {
  const url = `${host.io}/api/live/objects/${id}`;
  let res: AxiosResponse;
  try {
    res = await get(url);
  } catch (e) {
    return null;
  }

  return new TalkInfoModel(res.data.object, res.data.users, res.data.speakers, res.data.categories, res.data.tags, res.data.currentUserInfo)
};

export const listTalkComments = async (id: string, size = 20, marker = '', sorts = ['-createdAt']): Promise<TalkCommentModel[]> => {
  const query = {
    createdAt: marker,
    size: size,
    sorts: sorts.join(',')
  };
  const url = `${host.io}/api/live/objects/${id}/comments?${params(query)}`;
  let res: AxiosResponse;
  try {
    res = await get(url);
  } catch (e) {
    return [];
  }

  const result = res.data.result;
  const users = res.data.include ? res.data.include.users : null;
  const comments = [];

  if (!result || !result.length) return [];

  for (let item of result) {
    comments.push(new TalkCommentModel(item, users))
  }

  return comments;
};

export const postTalkComment = async (id: string, content: string, parentId?: string) => {
  const data = {
    content,
    parentId
  };

  const url = `${host.io}/api/live/objects/${id}/comments`;
  try {
    await post(url, data);
  } catch (e) {
  }

  return;
};

export const favorite = async (id: string) => {
  const url = `${host.io}/api/live/my/favorited/objects/${id}`;
  try {
    await post(url, null);
  } catch (e) {
  }

  return;
};

export const unfavorite = async (id: string) => {
  const url = `${host.io}/api/live/my/favorited/objects/${id}`;
  try {
    await del(url);
  } catch (e) {
  }

  return;
};

export const praise = async (id: string) => {
  const url = `${host.io}/api/live/my/praised/objects/${id}`;
  try {
    await post(url, null);
  } catch (e) {
  }

  return;
};

export const unpraise = async (id: string) => {
  const url = `${host.io}/api/live/my/praised/objects/${id}`;
  try {
    await del(url);
  } catch (e) {
  }

  return;
};

export const getTalkEmphasis = async (id: string): Promise<TalkEmphasisModel[]> => {
  const url = `${host.io}/api/live/media/${id}/cues?size=1000`;
  let res: AxiosResponse;
  try {
    res = await get(url);
  } catch (e) {
    return [];
  }

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
