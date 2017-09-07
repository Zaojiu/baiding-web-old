import {isInWechat, isWindowsWechat} from "./utils";
import {appConfig, host} from "../../env/environment";
import {post} from "../api/xhr";
import {
  paymentStore, PayStatus, setPaymentFail, setPaymentNone, setPaymentPaying, setPaymentSuccess,
} from "../../store/payment";
import {getOrder} from "../api/order.api";
import {AxiosResponse} from "axios";
import {ApiCode} from "../api/code-map.enum";
import {router} from "../../router";

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
  } else if (payResult === 'cancel') {
    setPaymentNone();
  } else {
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

export const pay = async (orderNo: string, redirectTo?: string): Promise<void> => {
  if (isInWechat && !isWindowsWechat) {
    await wechatPay(orderNo, redirectTo);
    // wechat pay change location and never resolve
    return new Promise<void>((resolve, reject) => {});
  } else {
    return pcPay(orderNo);
  }
};
