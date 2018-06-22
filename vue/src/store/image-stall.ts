import Vuex, {Commit} from 'vuex';
import Vue from 'vue';

export const SHOW_IMG = 'tip.SHOW_IMG';
export const HIDE_IMG = 'tip.HIDE_IMG';

Vue.use(Vuex);

class ImgState {
  status = false;
  imgUrl = '';
}

const state = new ImgState();

const mutations = {
  [SHOW_IMG]({imgUrl}: { imgUrl: string }, url: string) {
    state.status = true;
    state.imgUrl = url;
  },
  [HIDE_IMG]() {
    state.status = false;
    state.imgUrl = '';
  },
};

const actions = {
  [SHOW_IMG]: ({commit}: { commit: Commit }, url: string) => {
    commit(SHOW_IMG, url);
  },
  [HIDE_IMG]: ({commit}: { commit: Commit }) => {
    commit(HIDE_IMG);
  },
};

export const imgStore = new Vuex.Store<ImgState>({
  state: state,
  mutations: mutations,
  actions: actions,
  strict: true,
});

export const showImageStall = (url: string) => {
  imgStore.dispatch(SHOW_IMG, url);
};

export const hideImageStall = () => {
  imgStore.dispatch(HIDE_IMG);
};
