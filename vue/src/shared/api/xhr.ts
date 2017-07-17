import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import auth from '../auth';
import {SHOW_TIP, tipStore} from '../../store/tip';
import {ApiError, ApiErrorMessage} from "./code-map.enum";

export const defaults = {
  withCredentials: true
};

interface Config extends AxiosRequestConfig {
  needHandleError: boolean;
}

const interceptor = (result: AxiosError) => {
  result.response = result.response || {status: 0} as AxiosResponse;
  const httpCode: number = result.response.status;
  const customCode: number = result.response.data && result.response.data.code ? result.response.data.code : 0;

  if (httpCode === ApiError.ErrNeedToLogin || customCode === ApiError.ErrUnauthorized || customCode === ApiError.ErrNeedToLogin) {
    auth(location.href);
  } else if (customCode) {
    const message: string = ApiErrorMessage[customCode];
    if (message) {
      tipStore.dispatch(SHOW_TIP, message);
    } else {
      tipStore.dispatch(SHOW_TIP, `请求错误: ${customCode}`);
    }
  } else {
    const message: string = ApiErrorMessage[httpCode];
    if (httpCode >= 400 && httpCode < 500) {
      if (message) {
        tipStore.dispatch(SHOW_TIP, message)
      } else {
        tipStore.dispatch(SHOW_TIP, '提交数据错误')
      }
    } else if (httpCode >= 500 && httpCode < 600) {
      if (message) {
        tipStore.dispatch(SHOW_TIP, message)
      } else {
        tipStore.dispatch(SHOW_TIP, '服务器内部错误，请重试')
      }
    } else {
      tipStore.dispatch(SHOW_TIP, '请求错误')
    }
  }

  return Promise.reject(result);
};

export const get = (url: string, config?: Config) => {
  const needHandleError = config ? config.needHandleError === false : true;
  return axios.get(url, Object.assign(defaults, config)).catch(err => needHandleError ? interceptor(err) : Promise.reject(err));
};
export const post = (url: string, data?: any, config?: Config) => {
  const needHandleError = config ? config.needHandleError === false : true;
  return axios.post(url, data, Object.assign(defaults, config)).catch(err => needHandleError ? interceptor(err) : Promise.reject(err));
};
export const put = (url: string, data?: any, config?: Config) => {
  const needHandleError = config ? config.needHandleError === false : true;
  return axios.put(url, data, Object.assign(defaults, config)).catch(err => needHandleError ? interceptor(err) : Promise.reject(err));
};
export const del = (url: string, config?: Config) => {
  const needHandleError = config ? config.needHandleError === false : true;
  return axios.delete(url, Object.assign(defaults, config)).catch(err => needHandleError ? interceptor(err) : Promise.reject(err));
};
