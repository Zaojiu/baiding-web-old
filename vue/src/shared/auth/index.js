import { host } from '../../env/environment';
import iosBridge from '../ios';
import { Utils } from '../utils/utils';

// TODO: interface define.

const wechatAuth = (redirectTo) => {
  redirectTo = redirectTo || location.href;
  location.href = `${host.auth}/oauth2/wechat/redirect?to=${redirectTo}`;
};

const pcAuth = (redirectTo) => {
  redirectTo = redirectTo || location.href;
  location.href = `${host.auth}/oauth2/wechat/redirect?device=web&to=${redirectTo}`;
};

const iosAuth = async (redirectTo) => {
  let query = redirectTo ? {to: redirectTo} : null;

  return iosBridge.getInstant().callHandler('login', query);
};

let auth;

if (Utils.isInWechat) {
  auth = wechatAuth;
} else if (Utils.isInApp) {
  auth = iosAuth;
} else {
  auth = pcAuth;
}

export default auth;
