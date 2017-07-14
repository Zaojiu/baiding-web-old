import {host} from '../../env/environment';
import iosBridge from '../ios';
import {isInApp, isInWechat} from '../utils/utils';

// TODO: interface define.

const wechatAuth = (redirectTo: string) => {
  redirectTo = redirectTo || location.href;
  location.href = `${host.auth}/oauth2/wechat/redirect?to=${redirectTo}`;
};

const pcAuth = (redirectTo: string) => {
  redirectTo = redirectTo || location.href;
  location.href = `${host.auth}/oauth2/wechat/redirect?device=web&to=${redirectTo}`;
};

const iosAuth = async (redirectTo: string) => {
  const query = redirectTo ? {to: redirectTo} : null;
  const bridge = await iosBridge.getInstant();
  return bridge.callHandler('login', query);
};

let auth;

if (isInWechat) {
  auth = wechatAuth;
} else if (isInApp) {
  auth = iosAuth;
} else {
  auth = pcAuth;
}

export default auth;
