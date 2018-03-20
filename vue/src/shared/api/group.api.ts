import {host} from '../../env/environment';
import {get, post} from './xhr';
import {models} from '../../shared/api/group.model';
import {ColumnItem} from './column.model';
import {async} from "rxjs/scheduler/async";

const pushUserInfo = (groupData: any, userData: any) => {
  //将用户信息导入内容数组
  groupData.forEach((item: any, index: any) => {
    for (let key of Object.keys(userData)) {
      if (item.uid == Number(key)) {
        item.userInfo = userData[key];
      }
    }
  });
  return groupData;
};

export const getData = async (groupId: string, size: number, createdAt: string): Promise<any> => {
  let url;

  if (createdAt) {
    url = `${ host.io }/api/group/groups/${ groupId }/messages?sorts=-createdAt&size=${ size }＆createdAt=${ createdAt }`;
  } else {
    url = `${ host.io }/api/group/groups/${ groupId }/messages?sorts=-createdAt&size=${ size }`;
  };

  try {
    let res = await get(url);
    return pushUserInfo(res.data.result, res.data.include.users);
  } catch (e) {
    throw e;
  }
}

export const postMessage = async (groupId: string, toUids: number, content: string): Promise<any> => {
  const data = {
    type: "text",
    toUids: [toUids],
    content: content
  }
  let url = `${ host.io }/api/group/groups/${ groupId }/messages`;

  try {
    await post(url, data);
  } catch (e) {
    //
  }
  return;
}

export const getMessageDedail = async (groupId: string, msgId: string): Promise<any> => {
  let url = `${ host.io }/api/group/groups/${ groupId }/messages/${ msgId }`;

  try {
    let res = await get(url);
    let key = Object.keys(res.data.users)[0];
    res.data.userInfo = res.data.users[key];
    return res.data;
  } catch (e) {
    //
  }
}

export const getComments = async (groupId: string, msgId: string, size: number, createdAt: string): Promise<any> => {
  let url;

  if (createdAt) {
    url = `${ host.io }/api/group/groups/${ groupId }/messages/${ msgId }/comments?size=${ size }&sorts=-createdAt&createdAt=${ createdAt }`;
  } else {
    url = `${ host.io }/api/group/groups/${ groupId }/messages/${ msgId }/comments?size=${ size }&sorts=-createdAt`;
  }

  try {
    let res = await get(url);
    return pushUserInfo(res.data.result, res.data.include.users);
  } catch (e) {
    //
  }
}

export const postComment = async (groupId: string, msgId: string, content: string, uid: any): Promise<any> => {
  const data = {
    content: content,
    toUids: uid,
  }

  let url = `${ host.io }/api/group/groups/${ groupId }/messages/${ msgId }/comments`;

  try {
    let res = await post(url, data);
    return res; //判断响应码并反馈给用户
  } catch (e) {
    //
  }
}

