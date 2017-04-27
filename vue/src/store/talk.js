import Vue from 'vue';
import talkApi from '../shared/api/talk.api'

export const FETCH_TALK = 'talks.FETCH_TALK'
export const ADD_TALK = 'talks.ADD_TALK'

const state = {
  talks: {}
}

const mutations = {
  [ADD_TALK] ({ talks }, newTalk) {
    Vue.set(talks, newTalk.id, newTalk.info)
  }
}

const actions = {
  [FETCH_TALK]: async ({ commit }, id) => {
    const talkInfo = await talkApi.getTalkInfo(id)
    commit(ADD_TALK, { id: id, info: talkInfo })
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions
}
