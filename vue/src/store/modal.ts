import Vuex, {Commit} from "vuex";

let rejecter: (() => void)|null;
let resolver: (() => void)|null;

export enum ModalPopupStatus {
  Popup = 'popup',
  Cancel = 'cancel',
  Comfirm = 'comfirm',
}

class ModalOption {
  content: string;
  cancelText: string;
  confirmText: string;
  hasCancelBtn: boolean;
  link: string;
  target: string;
}

class ModalState {
  status: ModalPopupStatus = ModalPopupStatus.Cancel;
  options: ModalOption = new ModalOption();
}

const state = new ModalState();
const mutations = {
  [ModalPopupStatus.Popup](state: ModalState, options: ModalOption) {
    state.options = options;
    state.status = ModalPopupStatus.Popup;
  },
  [ModalPopupStatus.Cancel](state: ModalState) {
    state.status = ModalPopupStatus.Cancel;
  },
  [ModalPopupStatus.Comfirm](state: ModalState) {
    state.status = ModalPopupStatus.Comfirm;
  },
};
const actions = {
  [ModalPopupStatus.Popup]: ({commit}: { commit: Commit }, options: ModalOption) => {
    commit(ModalPopupStatus.Popup, options);
  },
  [ModalPopupStatus.Cancel]: ({commit}: { commit: Commit }) => {
    commit(ModalPopupStatus.Cancel);
  },
  [ModalPopupStatus.Comfirm]: ({commit}: { commit: Commit }) => {
    commit(ModalPopupStatus.Comfirm);
  },
};

export const modalStore = new Vuex.Store<ModalState>({
  state: state,
  mutations: mutations,
  actions: actions,
  strict: true,
});

modalStore.subscribe((mutation, state) => {
  if (mutation.type === ModalPopupStatus.Cancel) {
    if (rejecter) rejecter();
    resolver = null;
    rejecter = null;
  }

  if (mutation.type === ModalPopupStatus.Comfirm) {
    if (resolver) resolver();
    resolver = null;
    rejecter = null;
  }
});

export const showModal = (content: string, confirmText = '确定', hasCancelBtn = true, cancelText = '取消', link = '', target = '_blank'): Promise<void> => {
  const option = new ModalOption();
  option.content = content;
  option.cancelText = cancelText;
  option.confirmText = confirmText;
  option.hasCancelBtn = hasCancelBtn;
  option.link = link;
  option.target = target;

  modalStore.dispatch(ModalPopupStatus.Popup, option);

  return new Promise<void>((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });
};

export const cancelModal = () => {
  modalStore.dispatch(ModalPopupStatus.Cancel);
};

export const confirmModal = () => {
  modalStore.dispatch(ModalPopupStatus.Comfirm);
};
