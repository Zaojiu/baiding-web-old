//@flow
export const SHOW_TIP = 'tip.SHOW_TIP';
export const SHOW_TIPS = 'tip.SHOW_TIPS';
export const HIDE_TIPS = 'tip.HIDE_TIPS';

const state = {
  status: false,
  errorMessage: ''
};

const mutations = {
  [SHOW_TIPS] ({errorMessage}, err) {
    state.status = true
    state.errorMessage = err
  },
  [HIDE_TIPS] () {
    state.status = false
  },
};

const actions = {
  [SHOW_TIP]: ({commit}, err) => {
    commit(SHOW_TIPS, err);
    setTimeout(() => {
      commit(HIDE_TIPS)
    }, 2000)
  },
};

export default {
  state: state,
  mutations: mutations,
  actions: actions
}
