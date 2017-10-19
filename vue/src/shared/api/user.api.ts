import {get, post} from "./xhr";
import {host} from '../../env/environment'
import {UserDetailInfoModel, UserInfoModel, WechatSigninQrcodeModel} from './user.model'
import {AxiosResponse} from "axios";
import {Store} from "../utils/store";
import router from '../../router';

export const getUserInfo = async (needHandleError = true): Promise<UserInfoModel> => {
  const url = `${host.io}/api/user`;
  const res = await get(url, {needHandleError: needHandleError});
  const userInfo = new UserInfoModel(res.data);
  Store.memoryStore.set('userInfo', userInfo);
  return userInfo;
};

export const getUserInfoCache = (needSignin = true): UserInfoModel => {
  const userInfoCache = Store.memoryStore.get('userInfo');

  if (!userInfoCache) {
    if (needSignin) router.push({path: '/signin', query: {redirectTo: location.href}});
    throw new Error('user no login');
  }

  return new UserInfoModel(userInfoCache);
};

export const refreshUserInfo = async (needHandleError = false): Promise<UserInfoModel> => {
  Store.memoryStore.delete('userInfo');
  return getUserInfo(needHandleError);
}

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

export const signin = async (username: string, code: string, password: string, codeMap?: { [key: number]: string }): Promise<void> => {
  const query = {
    useSms: !!code,
  };
  const url = `${host.io}/api/user/login?${$.param(query)}`;
  const data: { [key: string]: string } = {username};
  if (code) data['code'] = code;
  if (password) data['password'] = password;

  await post(url, data, {codeMap: codeMap});
  await getUserInfo();
  return;
};

export const signup = async (mobile: string, code: string, password: string, realname: string, company: string, position: string, codeMap?: {[key: number]: string}): Promise<void> => {
  const url = `${host.io}/api/user/mobile/bind`;
  const data = {
    mobile,
    password,
    code,
    realname,
    company,
    position,
  };

  await post(url, data, {codeMap});
  return;
};

export const resetPassword = async (mobile: string, code: string, password: string, codeMap?: {[key: number]: string}): Promise<void> => {
  const url = `${host.io}/api/user/login/reset`;
  const data = {
    mobile,
    password,
    code,
  };

  await post(url, data, {codeMap: codeMap});
  return;
};
