import Vuex, {Commit} from 'vuex';
import Vue from 'vue';

export const SHOW_LOGIN = 'tip.SHOW_LOGIN';
export const HIDE_LOGIN = 'tip.HIDE_LOGIN';

Vue.use(Vuex);

class LoginState {
  status = false;
}

const state = new LoginState();

const mutations = {
  [SHOW_LOGIN]() {
    state.status = true;
  },
  [HIDE_LOGIN]() {
    state.status = false;
  },
};

const actions = {
  [SHOW_LOGIN]: ({commit}: { commit: Commit }, url: string) => {
    commit(SHOW_LOGIN, url);
  },
  [HIDE_LOGIN]: ({commit}: { commit: Commit }) => {
    commit(HIDE_LOGIN);
  },
};

export const loginPopUpStore = new Vuex.Store<LoginState>({
  state: state,
  mutations: mutations,
  actions: actions,
  strict: true,
});

export const showLoginPopUp = () => {
  loginPopUpStore.dispatch(SHOW_LOGIN);
};

export const hideLoginPopUp = () => {
  loginPopUpStore.dispatch(HIDE_LOGIN);
};
