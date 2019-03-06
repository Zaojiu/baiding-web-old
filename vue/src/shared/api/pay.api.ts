import {isInApp, isInWechat, isWindowsWechat, isAndroid, isiOS, isInWeiBo} from "../utils/utils";
import {appConfig, host} from "../../env/environment";
import {post} from "./xhr";
import {
  paymentStore,
  PayStatus,
  setPaymentFail,
  setPaymentNone,
  setPaymentPaying,
  setPaymentSuccess
} from "../../store/payment";
import {getOrder} from "./order.api";
import {AxiosResponse} from "axios";
import {ApiCode} from "./code-map.enum";
import {router} from "../../router";
import {showTips} from "../../store/tip";
import {pay as iosPayBridge} from "../utils/ios"; // android ios 桥接方法一样
import {PayPlatform} from "./pay.enum";


let pcRejecter: ((reason: string) => void) | null;
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

const payResult = (router && router.currentRoute) ? router.currentRoute.query['payResult'] : '';
if (payResult) {
  if (payResult === 'success') {
    showTips('支付成功');
    setPaymentSuccess();
  } else if (payResult === 'cancel') {
    showTips('取消支付');
    setPaymentNone();
  } else {
    showTips('支付失败');
    setPaymentFail(payResult);
  }
}

//目前仅在微博webview中支持支付宝支付。
const alipayPay = async (orderNo: string, redirectTo?: string) => {
  const payUrl = `${host.io}/api/wallet/v2/order/${orderNo}/pay`;
  let resp: AxiosResponse;
  try {
    resp = await post(payUrl, {"platform": PayPlatform.Alipay, "return_url": redirectTo});
  } catch (e) {
    const data = e.data;
    if (data && data.code === ApiCode.ErrAlreadyPaid) {
      showTips('already paid');
      throw new Error('already paid');
    } else {
      showTips(e);
      throw e;
    }
  }
  const data = resp.data;
  // todo 返回支付宝收银页面URL，跳转到支付页面,maybe angular 也要实现一份
  location.href = data.payUrl;

  return new Promise<void>((resolve, reject) => {
  });
};

const wechatPay = async (orderNo: string, redirectTo?: string): Promise<void> => {

  const payUrl = `${host.io}/api/wallet/order/${orderNo}/pay`;
  let resp: AxiosResponse;
  try {
    resp = await post(payUrl, {"platform": PayPlatform.Wechat});
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

  const backto = redirectTo || location.href;
  location.href = `${appConfig.payAddress}?req=${encodeURIComponent(JSON.stringify(wxPayReq))}&backto=${encodeURIComponent(backto)}`;

  // wechat pay change location and never resolve
  return new Promise<void>((resolve, reject) => {
  });
};

const pcPay = async (orderNo: string): Promise<void> => {
  const payUrl = `${host.io}/api/wallet/order/${orderNo}/pay`;

  let resp: AxiosResponse;
  try {
    resp = await post(payUrl, {"platform": PayPlatform.Pc});
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

const iosPay = async (orderNo: string): Promise<void> => {
  const payUrl = `${host.io}/api/wallet/order/${orderNo}/pay`;

  let resp: AxiosResponse;
  try {
    resp = await post(payUrl, {"platform": PayPlatform.Ios});
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

  const wxPayReq = {
    appid: data.wxPay.request.appId,
    partnerid: data.wxPay.request.mchId,
    prepayid: data.wxPay.request.prepayId,
    noncestr: data.wxPay.request.nonceStr,
    timestamp: data.wxPay.request.timeStamp,
    sign: data.wxPay.request.paySign,
  };

  iosPayBridge(wxPayReq);

  // ios pay never resolve
  setPaymentPaying('');

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

const androidPay = async (orderNo: string): Promise<void> => {
  const payUrl = `${host.io}/api/wallet/order/${orderNo}/pay`;

  let resp: AxiosResponse;
  try {
    resp = await post(payUrl, {"platform": PayPlatform.Android});
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

  const wxPayReq = {
    appid: data.wxPay.request.appId,
    partnerid: data.wxPay.request.mchId,
    prepayid: data.wxPay.request.prepayId,
    noncestr: data.wxPay.request.nonceStr,
    timestamp: data.wxPay.request.timeStamp,
    sign: data.wxPay.request.paySign,
  };

  iosPayBridge(wxPayReq);

  // ios pay never resolve
  setPaymentPaying('');

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
// 判断支付方式
export const pay = async (orderNo: string, redirectTo?: string ): Promise<void> => {
  if (isInWechat && !isWindowsWechat) {
    return wechatPay(orderNo, redirectTo);
  } else if (isInApp && isiOS) {
    return iosPay(orderNo);
  } else if (isInApp && isAndroid) {
    return androidPay(orderNo);
  } else if (isInWeiBo) {
    return alipayPay(orderNo, redirectTo);
  } else {
    return pcPay(orderNo);
  }
};
