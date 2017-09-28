import Vuex, {Commit} from "vuex";
import Vue from 'vue';

export const SHOW_SHARE_POPUP = 'tip.SHOW_SHARE_POPUP';
export const HIDE_SHARE_POPUP = 'tip.HIDE_SHARE_POPUP';

Vue.use(Vuex);

class ShareState {
  isPopup = false;
  link = '';
}

const state = new ShareState();

const mutations = {
  [SHOW_SHARE_POPUP] (state: ShareState, link: string) {
    state.isPopup = true;
    state.link = link;
  },
  [HIDE_SHARE_POPUP] () {
    state.isPopup = false;
    state.link = '';
  },
};

const actions = {
  [SHOW_SHARE_POPUP]: ({ commit }: { commit: Commit }, link: string) => {
    commit(SHOW_SHARE_POPUP, link);
  },
  [HIDE_SHARE_POPUP]: ({ commit }: { commit: Commit }) => {
    commit(HIDE_SHARE_POPUP);
  },
};

export const shareStore = new Vuex.Store<ShareState>({
  state: state,
  mutations: mutations,
  actions: actions,
  strict: true,
});

export const showSharePopup = (link: string) => {
  shareStore.dispatch(SHOW_SHARE_POPUP, link);
};

export const hideSharePopup = () => {
  shareStore.dispatch(HIDE_SHARE_POPUP);
};
