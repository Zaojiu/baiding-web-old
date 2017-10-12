import Vuex, {Commit} from "vuex";
import Vue from 'vue';

export const SHOW_QRCODE = 'tip.SHOW_QRCODE';
export const HIDE_QRCODE = 'tip.HIDE_QRCODE';

Vue.use(Vuex);

class QrcodeState {
  isPopup = false;
  url = '';
  tips = '';
}

const state = new QrcodeState();

const mutations = {
  [SHOW_QRCODE] (state: QrcodeState, payload: {url: string, tips: string}) {
    state.isPopup = true;
    state.url = payload.url;
    state.tips = payload.tips;
  },
  [HIDE_QRCODE] () {
    state.isPopup = false;
    state.url = '';
    state.tips = '';
  },
};

const actions = {
  [SHOW_QRCODE]: ({ commit }: { commit: Commit }, payload: {url: string, tips: string}) => {
    commit(SHOW_QRCODE, payload);
  },
  [HIDE_QRCODE]: ({ commit }: { commit: Commit }) => {
    commit(HIDE_QRCODE);
  },
};

export const qrcodeStore = new Vuex.Store<QrcodeState>({
  state: state,
  mutations: mutations,
  actions: actions,
  strict: true,
});

export const showQrcode = (url: string, tips: string) => {
  qrcodeStore.dispatch(SHOW_QRCODE, {url, tips});
};

export const hideQrcode = () => {
  qrcodeStore.dispatch(HIDE_QRCODE);
};
