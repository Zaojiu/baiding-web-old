import Vue from 'vue';
import talkApi from '../shared/api/talk.api'

export const FETCH_TALK = 'talks.FETCH_TALK'
export const ADD_TALK = 'talks.ADD_TALK'
export const FETCH_TALK_COMMENT = 'talks.FETCH_TALK_COMMENT'
export const ADD_TALK_COMMENT = 'talks.ADD_TALK_COMMENT'
export const REMOVE_TALK_COMMENT = 'talks.REMOVE_TALK_COMMENT'
export const POST_TALK_COMMENT = 'talks.POST_TALK_COMMENT'
export const TALK_COMMENT_COUNT = 20

const state = {
  info: {},
  comments: {}
}

const mutations = {
  [ADD_TALK] ({ info }, newTalk) {
    Vue.set(info, newTalk.id, newTalk.info)
  },
  [ADD_TALK_COMMENT] ({ comments }, talkComments) {
    if (comments[talkComments.id]) {
      comments[talkComments.id].data.push(...talkComments.comments)
      comments[talkComments.id].hasMore = talkComments.hasMore
    } else {
      Vue.set(comments, talkComments.id, {data: talkComments.comments, hasMore: talkComments.hasMore})
    }
  },
  [REMOVE_TALK_COMMENT] ({ comments }, id) {
    Vue.set(comments, id, undefined)
  }
}

const actions = {
  [FETCH_TALK]: async ({ commit }, id) => {
    const talkInfo = await talkApi.getTalkInfo(id)
    commit(ADD_TALK, { id: id, info: talkInfo })
  },
  [FETCH_TALK_COMMENT]: async ({ commit, state }, id) => {
    const comments = state.comments[id] || {data: [], hasMore: false}
    const lastMarker = comments && comments.data.length ? `$lt${comments.data[comments.data.length-1].originCreatedAt}` : '';
    const talkComments = await talkApi.listTalkComments(id, TALK_COMMENT_COUNT+1, lastMarker);
    let hasMore = false;
    if (talkComments.length === TALK_COMMENT_COUNT+1) {
      hasMore = true;
      talkComments.pop()
    }
    commit(ADD_TALK_COMMENT, { id: id, comments: talkComments, hasMore: hasMore})
  },
  [POST_TALK_COMMENT]: async ({ commit, state }, data) => {
    const talkInfo = {...state.info[data.id]}
    talkInfo.commentTotal += 1;
    await talkApi.postTalkComment(data.id, data.content, data.parentId)
    commit(REMOVE_TALK_COMMENT, data.id)
    commit(ADD_TALK, {id: data.id, info: talkInfo})
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions
}
