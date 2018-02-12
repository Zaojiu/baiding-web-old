import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {host} from '../../env/environment';
import {AxiosResponse} from 'axios';
import {Store} from '../utils/store';
import {showTips} from '../../store/tip';

const get = async (url: string) => {
  const _config = {
    withCredentials: true
  };
  return axios.get(url, _config);
};

const post = async (url: string, data?: any) => {
  const _config = {
    withCredentials: true
  };
  return axios.post(url, data, _config);
};

export const createTest = async (): Promise<void> => {
  const url = `${host.io}/api/question/my/question_rounds`;
  let res: AxiosResponse;
  res = await post(url);
  Store.memoryStore.set('popQuizData', res.data);
};

export const getCreateTestData = () => {
  return Store.memoryStore.get('popQuizData');
};

export const deleteTestData = () => {
  return Store.memoryStore.delete('popQuizData');
};

export const postTest = async (id: string, answer: number): Promise<any> => {
  const url = `${host.io}/api/question/my/question_rounds/${id}/answers`;
  let res: AxiosResponse;
  const data = {answer: answer};
  try {
    res = await post(url, data);
  } catch (e) {
    showTips(e.message);
    throw e;
  }
  return res.data;
};


export const postAddress = async (name: string, address: string, mobile: string): Promise<void> => {
  const url = `${host.io}/api/question/my/user_info`;
  let res: AxiosResponse;
  const data = {name, address, mobile};
  try {
    res = await post(url, data);
  } catch (e) {
    showTips('提交失败！请重试');
    throw e;
  }
};

export const getWordRank = async (): Promise<any> => {
  const url = `${host.io}/api/question/scoreboard`;
  let res: AxiosResponse;
  try {
    res = await get(url);
  } catch (e) {
    showTips(e.message);
    throw e;
  }
  return res.data;
};


export const getCardNum = async (): Promise<any> => {
  const url = `${host.io}/api/question/my/game_profile`;
  let res: AxiosResponse;
  res = await get(url);
  return res.data;
};

export const getPrizesNum = async (): Promise<any> => {
  const url = `${host.io}/api/question/my/prizes`;
  let res: AxiosResponse;
  try {
    res = await get(url);
  } catch (e) {
    showTips(e.message);
    throw e;
  }
  return res.data;
};

export const openShare = async (uid: number): Promise<void> => {
  const url = `${host.io}/api/question/my/open_share`;
  let res: AxiosResponse;
  try {
    res = await post(url, {uid});
  } catch (e) {
    throw e;
  }
};


