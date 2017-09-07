import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import router from '../../router';
import {showTips} from '../../store/tip';
import {ApiCode, ApiErrorMessage} from "./code-map.enum";
import {Store} from "../utils/store";
import {getRelativePath} from '../utils/utils';

export const defaults = {
  withCredentials: true
};

interface Config extends AxiosRequestConfig {
  needHandleError?: boolean;
  codeMap?: { [key: number]: string };
}

export class ApiError extends Error {
  code: number;
  message: string;
  originError: AxiosError;

  constructor(code: number, message: string, originError: AxiosError) {
    super();
    Object.setPrototypeOf(this, ApiError.prototype);

    this.code = code;
    this.message = `api request failed. code: ${code}, message: ${message}`;
    this.originError = originError;
  }

  get isUnauthorized(): boolean {
    return this.code === ApiCode.ErrUnauthorized || this.code === ApiCode.ErrNeedToLogin || this.code === ApiCode.ErrNeedToLogin;
  }

  get is4xx(): boolean {
    return this.code >= 400 && this.code < 500;
  }

  get is5xx(): boolean {
    return this.code >= 500 && this.code < 600;
  }
}

const errorHandler = (err: ApiError, customCodeMap?: { [key: number]: string }) => {
  if (err.isUnauthorized) {
    Store.localStore.delete('userInfo');
    showTips(`请登录`);
    router.push({path: '/signin', query: {redirectTo: getRelativePath(location.href, '/lives')}});
  } else {
    let message = '';
    const codeMap = Object.assign({}, ApiErrorMessage, customCodeMap);
    const customMessage = codeMap[err.code];

    if (customMessage) {
      message = customMessage;
    } else {
      if (err.is4xx) {
        message = '提交数据错误';
      } else if (err.is5xx) {
        message = '服务器内部错误，请重试';
      } else {
        message = `请求错误: ${err.code}`;
      }
    }

    showTips(message);
  }
};

const interceptor = (error: AxiosError, config?: Config) => {
  const resp = error.response;
  const data = resp && resp.data;
  const code = (data && data.code) || (resp && resp.status) || 0;
  const message = (data && data.message) || (resp && resp.statusText) || '';
  const apiError = new ApiError(code, message, error);

  const needHandleError = !(config && config.needHandleError === false);
  if (needHandleError) errorHandler(apiError, config && config.codeMap);

  return Promise.reject(apiError);
};

export const get = async (url: string, config?: Config) => {
  const _config = Object.assign({}, defaults, config);
  return axios.get(url, _config).catch(res => interceptor(res, _config));
};
export const post = async (url: string, data?: any, config?: Config) => {
  const _config = Object.assign({}, defaults, config);
  return axios.post(url, data, _config).catch(res => interceptor(res, _config));
};
export const put = async (url: string, data?: any, config?: Config) => {
  const _config = Object.assign({}, defaults, config);
  return axios.put(url, data, _config).catch(res => interceptor(res, _config));
};
export const del = async (url: string, config?: Config) => {
  const _config = Object.assign({}, defaults, config);
  return axios.delete(url, _config).catch(res => interceptor(res, _config));
};
