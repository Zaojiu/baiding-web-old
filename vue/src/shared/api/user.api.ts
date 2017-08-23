import {get, post} from "./xhr";
import {host} from '../../env/environment'
import {UserInfoModel, WechatSigninQrcodeModel} from './user.model'
import {ApiCode} from "./code-map.enum";
import {AxiosResponse} from "axios";
import {Store} from "../utils/store";
import router from '../../router';

export const getUserInfo = async (needHandleError = true): Promise<UserInfoModel> => {
  const url = `${host.io}/api/user`;
  let res: AxiosResponse;
  try {
    res = await get(url, {needHandleError: needHandleError});
  } catch (err) {
    throw err;
  }

  const userInfo = new UserInfoModel(res.data);

  Store.localStore.set('userInfo', userInfo);

  return userInfo;
};

export const getUserInfoCache = (signinTo?: string): UserInfoModel => {
  const userInfoCache = Store.localStore.get('userInfo');

  if (!userInfoCache) {
    if (signinTo) router.push({path: '/signin', query: {redirectTo: signinTo || location.href}});
    throw new Error('empty user info cache');
  }

  return new UserInfoModel(userInfoCache);
};

export const getWechatSigninQrcode = async (redirectTo: string): Promise<WechatSigninQrcodeModel | null> => {
  const query = {
    device: 'web',
    to: redirectTo,
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

export const signin = async (username: string, code: string, password: string, codeMap?: { [key: number]: string }): Promise<number> => {
  const query = {
    useSms: !!code,
  };
  const url = `${host.io}/api/user/login?${$.param(query)}`;
  const data: { [key: string]: string } = {username};
  if (code) data['code'] = code;
  if (password) data['password'] = password;

  try {
    await post(url, data, {codeMap: codeMap});
  } catch (err) {
    return err.code;
  }

  await getUserInfo(false);
  return ApiCode.OK;
};

export const signup = async (mobile: string, code: string, password: string, realname: string, company: string, position: string, codeMap?: {[key: number]: string}): Promise<number> => {
  const url = `${host.io}/api/user/mobile/bind`;
  const data = {
    mobile,
    password,
    code,
    realname,
    company,
    position,
  };

  try {
    await post(url, data, {codeMap: codeMap});
  } catch (err) {
    return err.code;
  }

  return ApiCode.OK;
};

export const resetPassword = async (mobile: string, code: string, password: string, codeMap?: {[key: number]: string}): Promise<number> => {
  const url = `${host.io}/api/user/login/reset`;
  const data = {
    mobile,
    password,
    code,
  };

  try {
    await post(url, data, {codeMap: codeMap});
  } catch (err) {
    return err.code;
  }

  return ApiCode.OK;
};
