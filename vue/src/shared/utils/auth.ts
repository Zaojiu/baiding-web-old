import {host} from '../../env/environment';
import {isInWechat} from './utils';
import {callHandler, initIOS} from "./ios";

export const wechatAuth = (redirectTo: string) => {
  redirectTo = redirectTo || location.href;
  location.href = `${host.auth}/oauth2/wechat/redirect?to=${redirectTo}`;
};

export const iosAuth = async (redirectTo: string) => {
  const query = redirectTo ? {to: redirectTo} : null;
  await initIOS();
  return callHandler('login', query);
};

export const auth: (redirectTo: string) => void = isInWechat ? wechatAuth : iosAuth;
