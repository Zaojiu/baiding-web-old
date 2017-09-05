import {isAndroid, isInApp, isInWechat, isiOS, isWindowsWechat} from "./utils";
import {appConfig, host} from "../../env/environment";
import {post} from "../api/xhr";
import {wechat} from "./wechat";
import {
  paymentStore, PayStatus, setPaymentFail, setPaymentNone, setPaymentPaying, setPaymentSuccess,
} from "../../store/payment";
import {getOrder} from "../api/order.api";
import {AxiosResponse} from "axios";
import {ApiCode} from "../api/code-map.enum";
import router from "../../router";

let pcRejecter: ((reason: string) => void)|null;
let timer: any;

const clear = () => {
  clearInterval(timer);
  pcRejecter = null;
};

paymentStore.subscribe((mutation, state) => {
  if (mutation.type === PayStatus.None) {
    if (pcRejecter) {
      pcRejecter('cancel');
      clear();
    }
  }
});

const payResult = router.currentRoute.query['payResult'];
if (payResult) {
  if (payResult === 'success') {
    setPaymentSuccess();
  } else {
    setPaymentFail(payResult);
  }
}

const _wechatPay = async (orderNo: string): Promise<void> => {
  const payUrl = `${host.io}/api/wallet/order/${orderNo}/pay`;

  let resp: AxiosResponse;
  try {
    resp = await post(payUrl, {"platform": 1});
  } catch (e) {
    const data = e.data;
    if (data && data.code === ApiCode.ErrAlreadyPaid) {
      setPaymentFail('already paid');
      throw new Error('already paid');
    } else {
      setPaymentFail(e);
      throw e;
    }
  }

  const data = resp.data;

  if (data.isOngoing) return;

  const wxPayReq = data.wxPay.request;

  //hack uiwebview
  if (isiOS) {
    const url = location.href;
    location.href = `${appConfig.payAddress}?req=${encodeURIComponent(JSON.stringify(wxPayReq))}&backto=${encodeURIComponent(url)}`;
    throw new Error('cancel');
  }

  if (!(<any>window).WeixinJSBridge) {
    const reason = 'weixin_js_bridge_not_found';
    setPaymentFail(reason);
    throw new Error(reason);
  }

  try {
    await wechat.pay(wxPayReq);
  } catch (e) {
    if (e === 'cancel') {
      setPaymentNone();
    } else {
      setPaymentFail(e);
    }

    throw e;
  }

  setPaymentSuccess();
  return;
};

const wechatPay = async (orderNo: string): Promise<void> => {
  if (isAndroid) history.pushState({}, '微信支付', appConfig.payAddress);

  try {
    await wechat.init();
    await _wechatPay(orderNo);
  } finally {
    if (isAndroid) history.back();
  }

  return;
};

const pcPay = async (orderNo: string): Promise<void> => {
  const payUrl = `${host.io}/api/wallet/order/${orderNo}/pay`;

  let resp: AxiosResponse;
  try {
    resp = await post(payUrl, {"platform": 2});
  } catch (e) {
    const data = e.data;
    if (data && data.code === ApiCode.ErrAlreadyPaid) {
      setPaymentFail('already paid');
      throw new Error('already paid');
    } else {
      setPaymentFail(e);
      throw e;
    }
  }

  const data = resp.data;

  if (data.isOngoing) return;

  setPaymentPaying(data.wxPay.codeUrl);

  return new Promise<void>((resolve, reject) => {
    pcRejecter = reject;

    let count = 0;
    timer = setInterval(async () => {
      const order = await getOrder(orderNo, false);

      if (order.isSuccess) {
        clear();
        resolve();
        setPaymentSuccess();
        return;
      }

      if (order.isClosed) {
        clear();
        reject('closed');
        setPaymentFail('closed');
        return;
      }

      if (count > 100) {
        clear();
        reject('timeout');
        setPaymentFail('timeout');
        return;
      }

      count++;
    }, 3 * 1000);
  });
};

export const pay = async (orderNo: string): Promise<void> => {
  if (isInWechat && !isWindowsWechat) {
    await wechatPay(orderNo);
  } else if (isInApp) {
    // TODO: app payment, 在ios中不能使用微信支付, 付费直播间app中不可点击
  } else {
    await pcPay(orderNo);
  }

  return;
};
