import axios from 'axios'
import auth from '../auth'
import {SHOW_TIP} from '../../store/tip'
import ApiErrorMessage from "./code-map.enum";

export const defaults = {
  withCredentials: true
};

const interceptor = (forceAuth, result) => {
  result.reponse = result.reponse || {status: 0};
  const httpCode = result.response.status;
  const customCode = result.response.data && result.response.data.code ? result.response.data.code : 0;

  if (httpCode === 401 && forceAuth) {
    if (typeof forceAuth === 'string') {
      auth(forceAuth);
    } else {
      auth(location.href);
    }
  } else if (customCode) {
    const message = ApiErrorMessage[customCode];
    if (message) {
      this.$store.dispatch(SHOW_TIP, message);
    } else {
      this.$store.dispatch(SHOW_TIP, `请求错误: ${customCode}`);
    }
  } else {
    const message = ApiErrorMessage[httpCode];
    if (httpCode >= 400 && httpCode < 500) {
      if (message) {
        this.$store.dispatch(SHOW_TIP, message)
      } else {
        this.$store.dispatch(SHOW_TIP, '提交数据错误')
      }
    } else if (httpCode >= 500 && httpCode < 600) {
      if (message) {
        this.$store.dispatch(SHOW_TIP, message)
      } else {
        this.$store.dispatch(SHOW_TIP, '服务器内部错误，请重试')
      }
    } else {
      this.$store.dispatch(SHOW_TIP, '请求错误')
    }
  }

  return Promise.reject(result);
};

export default {
  get (url, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.get(url, Object.assign(defaults, config)).catch(err => interceptor(forceAuth, err));
  },
  post (url, data, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.post(url, data, Object.assign(defaults, config)).catch(err => interceptor(forceAuth, err));
  },
  put (url, data, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.put(url, data, Object.assign(defaults, config)).catch(err => interceptor(forceAuth, err));
  },
  delete (url, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.delete(url, Object.assign(defaults, config)).catch(err => interceptor(forceAuth, err));
  },
}
