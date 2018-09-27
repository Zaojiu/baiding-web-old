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
import { Store } from "../utils/store";
import { get } from "../api/xhr";
import { UserInfoModel } from "../api/user.model";

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

export const auth4MobileGuardN = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    const url = `${host.io}/api/user`;
    const res = await get(url, { needHandleError: true });
    alert(1);
    if (res.status == 401) {
      alert(2);
      return false;
    }
    const userInfo = new UserInfoModel(res.data);
    Store.memoryStore.set("userInfo", userInfo);
    Store.localStore.set("userinfo", userInfo); // angular使用userinfo
    return true;
  };
};

export const auth4MobileGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    const res = getUserInfo4Mobile();
    if (!res) {
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
    try {
      const userInfo = getUserInfoCache(false);
      if (!userInfo.mobile.number) {
        if (isInWechat) {
          location.href = `${
            host.auth
          }/oauth2/wechat/redirect?isBindMobile=${BindMobile}&mobile=&to=${
            host.self
          }/member/activate`;
          return false;
        } else {
          //TODO
          return true;
        }
      }
    } catch (err) {
      if (isInWechat) {
        location.href = `${
          host.auth
        }/oauth2/wechat/redirect?isBindMobile=${BindMobile}&mobile=&to=${
          host.self
        }/member/activate`;
        return false;
      } else {
        //TODO
        return true;
      }
    }
    return true;
  };
};
