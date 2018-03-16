import {host} from '../../env/environment';
import {get, post} from './xhr';
import {models} from '../../shared/api/group.model';
import {ColumnItem} from './column.model';

export const getData = async (groupId: string, size: number, createdAt: string): Promise<any> => {
  let url;
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

  if (createdAt) {
    url = `${ host.io }/api/group/groups/${ groupId }/messages?sorts=-createdAt&size=${ size }＆createdAt=${ createdAt }`;
  } else {
    url = `${ host.io }/api/group/groups/${ groupId }/messages?sorts=-createdAt&size=${ size }`;
  };

  try {
    let res = await get(url);
    return pushUserInfo(res.data.result, res.data.include.users);
  } catch (e) {
    //
  }
  return;
}

export const postMessage = async (groupId: string, toUids: string, content: string): Promise<any> => {
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

