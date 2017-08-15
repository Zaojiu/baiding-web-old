import {ApiError, get, post} from "./xhr";
import {host} from '../../env/environment'
import {UserInfoModel, WechatSigninQrcodeModel} from './user.model'
import {ApiCode} from "./code-map.enum";
import {AxiosResponse} from "axios";

export const getUserInfo = async (needHandleError = true): Promise<UserInfoModel | ApiError> => {
  const url = `${host.io}/api/user`;
  let res: AxiosResponse;
  try {
    res = await get(url, {needHandleError: needHandleError});
  } catch (err) {
    throw err;
  }

  return new UserInfoModel(res.data);
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
