import {isInApp, isInWechat, isWindowsWechat} from "../utils/utils";
import {appConfig, host} from "../../env/environment";
import {post} from "./xhr";
import {paymentStore, PayStatus, setPaymentFail, setPaymentNone, setPaymentPaying, setPaymentSuccess} from "../../store/payment";
import {getOrder} from "./order.api";
import {AxiosResponse} from "axios";
import {ApiCode} from "./code-map.enum";
import {router} from "../../router";
import {showTips} from "../../store/tip";
import {pay as iosPayBridge} from "../utils/ios";

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

const wechatPay = async (orderNo: string, redirectTo?: string): Promise<void> => {
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

  const backto = redirectTo || location.href;
  location.href = `${appConfig.payAddress}?req=${encodeURIComponent(JSON.stringify(wxPayReq))}&backto=${encodeURIComponent(backto)}`;

  // wechat pay change location and never resolve
  return new Promise<void>((resolve, reject) => {});
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

const iosPay = async (orderNo: string): Promise<void> => {
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

  return iosPayBridge(wxPayReq);
};

export const pay = async (orderNo: string, redirectTo?: string): Promise<void> => {
  if (isInWechat && !isWindowsWechat) {
    return wechatPay(orderNo, redirectTo);
  } else if (isInApp) {
    return iosPay(orderNo);
  } else {
    return pcPay(orderNo);
  }
};
