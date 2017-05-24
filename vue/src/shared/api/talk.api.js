import xhr from './xhr'
import { host } from '../../env/environment'
import { TalkInfoModel, TalkCommentModel } from './talk.model'
import { Utils } from '../utils/utils'

export default {
  async getTalkInfo (id) {
    const url = `${host.io}/api/live/objects/${id}`
    const res = await xhr.get(url).catch(() => null);
    if (res === null) return null;
    return new TalkInfoModel(res.data.object, res.data.users, res.data.speakers, res.data.categories, res.data.tags, res.data.currentUserInfo)
  },

  async listTalkComments (id, size = 20, marker = '', sorts = ['-createdAt']) {
    const query = {
      createdAt: marker,
      size: size,
      sorts: sorts.join(',')
    };
    const url = `${host.io}/api/live/objects/${id}/comments?${Utils.params(query)}`
    const res = await xhr.get(url);
    const result = res.data.result;
    const users = res.data.include ? res.data.include.users : null;
    const comments = [];

    if (!result || !result.length) return [];

    for (let item of result) {
      comments.push(new TalkCommentModel(item, users))
    }

    return comments;
  },

  postTalkComment (id, content, parentId) {
    const data = {
      content,
      parentId
    };

    const url = `${host.io}/api/live/objects/${id}/comments`;
    return xhr.post(url, data);
  },

  favorite(id) {
    const url = `${host.io}/api/live/my/favorited/objects/${id}`;
    return xhr.post(url, null, {forceAuth: true});
  },

  unfavorite(id) {
    const url = `${host.io}/api/live/my/favorited/objects/${id}`;
    return xhr.delete(url, {forceAuth: true});
  },

  praise(id) {
    const url = `${host.io}/api/live/my/praised/objects/${id}`;
    return xhr.post(url, null, {forceAuth: true});
  },

  unpraise(id) {
    const url = `${host.io}/api/live/my/praised/objects/${id}`;
    return xhr.delete(url, {forceAuth: true});
  }
}