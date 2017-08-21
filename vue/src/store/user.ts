import Vuex, {Commit} from "vuex";
import Vue from 'vue';
import {getWechatSigninQrcode} from "../shared/api/user.api";
import {params} from "../shared/utils/utils";

export const SIGNIN_QRCODE = 'user.SIGNIN_QRCODE';
export const FETCH_SIGNIN_QRCODE = 'user.FETCH_SIGNIN_QRCODE';

Vue.use(Vuex);

class UserState {
  qrcodeUrl: string;
}

const state = new UserState();
const mutations = {
  [SIGNIN_QRCODE] (state: UserState, val: string) {
    state.qrcodeUrl = val;
  },
};
const actions = {
  [FETCH_SIGNIN_QRCODE]: async ({ commit }: { commit: Commit }, redirectTo: string): Promise<boolean> => {
    let qrcodeUrl = '';
    const qrcode = await getWechatSigninQrcode(redirectTo);
    if (qrcode) {
      const wechatUri = qrcode.wechat_uri;
      delete qrcode.wechat_uri;
      qrcodeUrl = `${wechatUri}?${params(qrcode)}`;
    }
    commit(SIGNIN_QRCODE, qrcodeUrl);
    const isSuccess = !!qrcodeUrl;
    return isSuccess;
  },
};

export const userStore = {state, mutations, actions};
