import { host } from "../../env/environment";
import { isInWechat } from "./utils";
import { callHandler, initIOS } from "./ios";

//不需要绑定手机号
export const NotBindMobile = false;
// 需要绑定手机号
export const BindMobile = true;

export const wechatAuth = (redirectTo: string) => {
  redirectTo = redirectTo || location.href;
  location.href = `${
    host.auth
  }/oauth2/wechat/redirect?isBindMobile=${NotBindMobile}&mobile=''&to=${redirectTo}`;
};

export const wechatAuth4Mobile = (
  redirectTo: string,
  isBindMobile: boolean,
  mobile: string
) => {
  redirectTo = redirectTo || location.href;
  location.href = `${
    host.auth
  }/oauth2/wechat/redirect?isBindMobile=${isBindMobile}&mobile=${mobile}&to=${redirectTo}`;
};

export const iosAuth = async (redirectTo: string) => {
  const query = redirectTo ? { to: redirectTo } : null;
  await initIOS();
  return callHandler("login", query);
};

export const auth: (redirectTo: string) => void = isInWechat
  ? wechatAuth
  : iosAuth;
