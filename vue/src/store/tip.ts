import Vuex, {Commit} from "vuex";
import Vue from 'vue';

export const SHOW_TIP = 'tip.SHOW_TIP';
export const SHOW_TIPS = 'tip.SHOW_TIPS';
export const HIDE_TIPS = 'tip.HIDE_TIPS';

Vue.use(Vuex);

class TipState {
  status = false;
  errorMessage = '';
}

const state = new TipState();

const mutations = {
  [SHOW_TIPS] ({ errorMessage }: { errorMessage: string }, err: string) {
    state.status = true;
    state.errorMessage = err
  },
  [HIDE_TIPS] () {
    state.status = false
  },
};

const actions = {
  [SHOW_TIP]: ({ commit }: { commit: Commit }, err: string) => {
    commit(SHOW_TIPS, err);
    setTimeout(() => commit(HIDE_TIPS), 2000);
  },
};

export const tipStore = new Vuex.Store<TipState>({
  state: state,
  mutations: mutations,
  actions: actions,
  strict: true,
});
