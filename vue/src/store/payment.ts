import Vuex, {Commit} from "vuex";

export enum PayStatus {
  None = 'none',
  Paying = 'paying',
  Success = 'succss',
  Failure = 'failure',
}

class PaymentState {
  qrcodeUrl = '';
  payStatus = PayStatus.None;
  message = '';
}

const state = new PaymentState();
const mutations = {
  [PayStatus.None](state: PaymentState) {
    state.qrcodeUrl = '';
    state.payStatus = PayStatus.None;
    state.message = '';
  },
  [PayStatus.Paying](state: PaymentState, wechatQrcodeLink: string) {
    state.qrcodeUrl = wechatQrcodeLink;
    state.payStatus = PayStatus.Paying;
    state.message = '';
  },
  [PayStatus.Success](state: PaymentState) {
    state.qrcodeUrl = '';
    state.payStatus = PayStatus.Success;
    state.message = '';
  },
  [PayStatus.Failure](state: PaymentState, reason: string) {
    state.qrcodeUrl = '';
    state.payStatus = PayStatus.Failure;
    state.message = reason;
  },
};
const actions = {
  [PayStatus.None]: ({commit}: { commit: Commit }) => {
    commit(PayStatus.None);
  },
  [PayStatus.Paying]: ({commit}: { commit: Commit }, wechatQrcodeLink: string) => {
    commit(PayStatus.Paying, wechatQrcodeLink);
  },
  [PayStatus.Success]: ({commit}: { commit: Commit }) => {
    commit(PayStatus.Success);
  },
  [PayStatus.Failure]: ({commit}: { commit: Commit }, reason: string) => {
    commit(PayStatus.Failure, reason);
  },
};

export const paymentStore = new Vuex.Store<PaymentState>({
  state: state,
  mutations: mutations,
  actions: actions,
  strict: true,
});

export const setPaymentNone = () => {
  paymentStore.dispatch(PayStatus.None);
};

export const setPaymentPaying = (qrcodeUrl: string) => {
  paymentStore.dispatch(PayStatus.Paying, qrcodeUrl);
};

export const setPaymentSuccess = () => {
  paymentStore.dispatch(PayStatus.Success);
};

export const setPaymentFail = (reason: string) => {
  paymentStore.dispatch(PayStatus.Failure, reason);
};
