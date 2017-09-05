import {host} from '../../env/environment';
import iosBridge from '../ios';
import {isInWechat} from '../utils/utils';

// TODO: interface define.

export const wechatAuth = (redirectTo: string) => {
  redirectTo = redirectTo || location.href;
  location.href = `${host.auth}/oauth2/wechat/redirect?to=${redirectTo}`;
};

export const iosAuth = async (redirectTo: string) => {
  const query = redirectTo ? {to: redirectTo} : null;
  const bridge = await iosBridge.getInstant();
  return bridge.callHandler('login', query);
};

export const auth: (redirectTo: string) => void = isInWechat ? wechatAuth : iosAuth;
