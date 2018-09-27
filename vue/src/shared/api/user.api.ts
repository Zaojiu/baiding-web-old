import { get, post } from "./xhr";
import { host } from "../../env/environment";
import {
  UserDetailInfoModel,
  UserInfoModel,
  WechatSigninQrcodeModel
} from "./user.model";
import { AxiosResponse } from "axios";
import { Store } from "../utils/store";
import { router } from "../../router";
import { isInWeiBo } from "../utils/utils";
import { showLoginPopUp } from "../../store/loginPopUp";
// add by ywz
import { NotBindMobile } from "../utils/auth";

export const getUserInfo = async (
  needHandleError = true
): Promise<UserInfoModel> => {
  const url = `${host.io}/api/user`;
  const res = await get(url, { needHandleError: needHandleError });
  const userInfo = new UserInfoModel(res.data);
  Store.memoryStore.set("userInfo", userInfo);
  Store.localStore.set("userinfo", userInfo); // angular使用userinfo
  return userInfo;
};

export const getUserInfoCache = (needSignin = true): UserInfoModel => {
  const userInfoCache = Store.memoryStore.get("userInfo");
  if (!userInfoCache) {
    if (needSignin) {
      // 在微博app webview中，登录使用弹窗登录组件
      if (isInWeiBo) {
        showLoginPopUp();
      } else {
        router.push({ path: "/signin", query: { redirectTo: location.href } });
      }
    }
    throw new Error("user no login");
  }

  return new UserInfoModel(userInfoCache);
};

export const getUserInfo4MobileCache = (needSignin = true): UserInfoModel => {
  const userInfoCache = Store.memoryStore.get("userInfo");
  if (!userInfoCache) {
    throw new Error("user no login");
  }
  return new UserInfoModel(userInfoCache);
};

export const getUserInfo4MobileBind = (needSignin = true): UserInfoModel => {
  const userInfoCache = Store.memoryStore.get("userInfo");
  if (!userInfoCache) {
    return new UserInfoModel("");
  }
  return new UserInfoModel(userInfoCache);
};

export const getUserInfo4MobileN = async (): Promise<boolean> => {
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

export const getUserInfo4Mobile = async (): Promise<boolean> => {
  try {
    await getUserInfo();
  } catch (e) {
    //nothing to do
  }
  const userInfoCache = Store.memoryStore.get("userInfo");
  if (!userInfoCache) {
    // const userInfoLocalCache = Store.localStore.get("userinfo");
    // if (!userInfoLocalCache) {
    return false;
    // }
    // return true;
  }
  return true;
};

export const refreshUserInfo4MobileBind = async () => {
  Store.memoryStore.delete("userInfo");
  Store.localStore.delete("userinfo");
};

export const getUserInfoCacheDiyRedirectTo = (
  needSignin = true,
  redirectTo: string
): UserInfoModel => {
  const userInfoCache = Store.memoryStore.get("userInfo");
  if (!userInfoCache) {
    if (needSignin) {
      if (isInWeiBo) {
        showLoginPopUp();
      } else {
        router.push({ path: "/signin", query: { redirectTo: redirectTo } });
      }
    }
    throw new Error("user no login");
  }

  return new UserInfoModel(userInfoCache);
};

export const refreshUserInfo = async (
  needHandleError = false
): Promise<UserInfoModel> => {
  Store.memoryStore.delete("userInfo");
  return getUserInfo(needHandleError);
};

export const getUserDetailInfo = async (): Promise<UserDetailInfoModel> => {
  const url = `${host.io}/api/user/detail`;
  let res: AxiosResponse;
  try {
    res = await get(url);
  } catch (e) {
    throw e;
  }

  return new UserDetailInfoModel(res.data);
};

export const getWechatSigninQrcode = async (
  redirectTo: string
): Promise<WechatSigninQrcodeModel | null> => {
  const query = {
    device: "web",
    to: redirectTo,
    isBindMobile: NotBindMobile,
    mobile: ""
  };
  const url = `${host.auth}/oauth2/wechat/redirect?${$.param(query)}`;
  let res: AxiosResponse;
  try {
    res = await get(url);
  } catch (e) {
    return null;
  }
  return new WechatSigninQrcodeModel(res.data);
};

export const signin = async (
  username: string,
  password: string,
  codeMap?: { [key: number]: string }
): Promise<void> => {
  const url = `${host.io}/api/user/login`;
  const data: { [key: string]: string } = { username, password };
  await post(url, data, { codeMap: codeMap });
  await getUserInfo();
  return;
};

export const signup = async (
  mobile: string,
  code: string,
  codeMap?: { [key: number]: string }
): Promise<void> => {
  const url = `${host.io}/api/user/login_or_register?useSms=true`;
  const data: { [key: string]: string } = { mobile, code };
  if (code) data["code"] = code;
  await post(url, data, { codeMap: codeMap });
  await getUserInfo();
  return;
};

export const signOut = async () => {
  const url = `${host.io}/api/user/logout`;
  await get(url);
  Store.memoryStore.delete("userInfo");
  Store.localStore.delete("userinfo");
  return;
};

export const bindMobile = async (
  mobile: string,
  code: string,
  password: string,
  realname: string,
  company: string,
  position: string,
  codeMap?: { [key: number]: string }
): Promise<void> => {
  const url = `${host.io}/api/user/mobile/bind`;
  const data = {
    mobile,
    password,
    code,
    realname,
    company,
    position
  };

  await post(url, data, { codeMap });
  return;
};

export const resetPassword = async (
  mobile: string,
  code: string,
  password: string,
  codeMap?: { [key: number]: string }
): Promise<void> => {
  const url = `${host.io}/api/user/login/reset`;
  const data = {
    mobile,
    password,
    code
  };

  await post(url, data, { codeMap: codeMap });
  return;
};
