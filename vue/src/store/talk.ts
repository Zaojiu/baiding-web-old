import Vue from 'vue';
import {Commit} from "vuex";
import {TalkCommentModel, TalkInfoModel} from "../shared/api/talk.model";
import {
  favorite,
  getTalkInfo, listTalkComments, postTalkComment, praise, unfavorite,
  unpraise
} from '../shared/api/talk.api';

export const FETCH_TALK = 'talks.FETCH_TALK';
export const ADD_TALK = 'talks.ADD_TALK';
export const FETCH_TALK_COMMENT = 'talks.FETCH_TALK_COMMENT';
export const ADD_TALK_COMMENT = 'talks.ADD_TALK_COMMENT';
export const REMOVE_TALK_COMMENT = 'talks.REMOVE_TALK_COMMENT';
export const POST_TALK_COMMENT = 'talks.POST_TALK_COMMENT';
export const TALK_COMMENT_COUNT = 20;
export const TOGGLE_TALK_PRAISE = 'talks.TOGGLE_TALK_PRAISE';
export const TOGGLE_TALK_FAVORITE = 'talks.TOGGLE_TALK_FAVORITE';

class TalkCommentsStore {
  id: string;
  comments: TalkCommentModel[];
  hasMore: boolean;

  constructor(id: string, comments: TalkCommentModel[], hasMore: boolean) {
    this.id = id;
    this.comments = comments;
    this.hasMore = hasMore;
  }
}

class TalkStateModel {
  info: {[key: string]: TalkInfoModel} = {};
  comments: {[key: string]: TalkCommentsStore} = {};
}

export class PostTalkCommentsPayload {
  id: string;
  content: string;
  parentId?: string;

  constructor(id: string, content: string, parentId?: string) {
    this.id = id;
    this.content = content;
    this.parentId = parentId;
  }
}

const state = new TalkStateModel();

const mutations = {
  [ADD_TALK] ({ info }: {info: {[key: string]: TalkInfoModel}}, newTalk: {id: string, info: TalkInfoModel}) {
    Vue.set(info, newTalk.id, newTalk.info)
  },
  [ADD_TALK_COMMENT] ({ comments }: {comments: {[key: string]: TalkCommentsStore}}, newCommentStore: TalkCommentsStore) {
    const commentStore = comments[newCommentStore.id];
    if (commentStore) {
      commentStore.comments.push(...newCommentStore.comments);
      commentStore.hasMore = newCommentStore.hasMore
    } else {
      Vue.set(comments, newCommentStore.id, {data: newCommentStore.comments, hasMore: newCommentStore.hasMore})
    }
  },
  [REMOVE_TALK_COMMENT] ({ comments }: {comments: {[key: string]: TalkCommentsStore}}, id: string) {
    Vue.set(comments, id, null)
  }
};

const actions = {
  [FETCH_TALK]: async ({ commit }: { commit: Commit}, id: string) => {
    const talkInfo = await getTalkInfo(id);
    commit(ADD_TALK, {id: id, info: talkInfo});
  },
  [FETCH_TALK_COMMENT]: async ({ commit, state }: { commit: Commit, state: TalkStateModel}, id: string) => {
    const commentStore = state.comments[id] || new TalkCommentsStore(id, [], false);
    const lastMarker = commentStore && commentStore.comments.length ? `$lt${commentStore.comments[commentStore.comments.length-1].originCreatedAt}` : '';
    const comments = await listTalkComments(id, TALK_COMMENT_COUNT+1, lastMarker);
    let hasMore = false;
    if (comments.length === TALK_COMMENT_COUNT+1) {
      hasMore = true;
      comments.pop()
    }
    commit(ADD_TALK_COMMENT, new TalkCommentsStore(id, comments, hasMore))
  },
  [POST_TALK_COMMENT]: async ({ commit, state }: { commit: Commit, state: TalkStateModel}, payload: PostTalkCommentsPayload) => {
    const talkInfo = {...state.info[payload.id]} as TalkInfoModel;
    talkInfo.commentTotal += 1;
    await postTalkComment(payload.id, payload.content, payload.parentId);
    commit(REMOVE_TALK_COMMENT, payload.id);
    commit(ADD_TALK, {id: payload.id, info: talkInfo})
  },
  [TOGGLE_TALK_PRAISE]: async ({ commit, state }: { commit: Commit, state: TalkStateModel}, id: string) => {
    const talkInfo = {...state.info[id]} as TalkInfoModel;
    const promise = talkInfo.isPraised ? unpraise(id) : praise(id);
    const res = await promise;
    if (res instanceof Error) return;
    talkInfo.isPraised = !talkInfo.isPraised;
    talkInfo.praiseTotal = talkInfo.isPraised ? talkInfo.praiseTotal + 1 : talkInfo.praiseTotal - 1;
    commit(ADD_TALK, {id: id, info: talkInfo});
  },
  [TOGGLE_TALK_FAVORITE]: async ({ commit, state }: { commit: Commit, state: TalkStateModel}, id: string) => {
    const talkInfo = {...state.info[id]} as TalkInfoModel;
    const promise = talkInfo.isFavorited ? unfavorite(id) : favorite(id);
    const res = await promise;
    if (res instanceof Error) return;
    talkInfo.isFavorited = !talkInfo.isFavorited;
    commit(ADD_TALK, {id: id, info: talkInfo});
  }
};

export const talkStore = {state, mutations, actions};
