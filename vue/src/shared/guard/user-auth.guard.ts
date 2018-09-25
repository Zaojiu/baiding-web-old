import {
  getUserInfoCache,
  getUserInfo4MobileBind,
  getUserInfo4Mobile
} from "../api/user.api";
import { Route } from "vue-router";
import { router } from "../../router";
import { isInWechat } from "../utils/utils";
import { host } from "../../env/environment";
import { BindMobile } from "../utils/auth";

export const authGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      getUserInfoCache(false);
    } catch (err) {
      router.push({ path: "/signin", query: { redirectTo: to.fullPath } });
      return false;
    }

    return true;
  };
};

export const auth4MobileGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      const hasUserInfoCache = getUserInfo4Mobile(false);
      if (!hasUserInfoCache) {
        if (isInWechat) {
          location.href = `${
            host.auth
          }/oauth2/wechat/redirect?isBindMobile=${BindMobile}&mobile=&to=${
            host.self
          }/member/activate`;
          return false;
        } else {
          router.push({ path: "/signin", query: { redirectTo: to.fullPath } });
          return false;
        }
      }
    } catch (err) {
      router.push({ path: "/signin", query: { redirectTo: to.fullPath } });
      return false;
    }
    return true;
  };
};
