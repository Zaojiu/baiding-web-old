import {get, post} from '../api/xhr';

declare const wx: any;
declare const Promise: any;

export const chooseImages = (count = 9): Promise<string[]> => {
  return new Promise((resolve: any, reject: any) => {
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res: any) => {
        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        resolve(localIds);
      },
      fail: (reason: any) => {
        reject(reason);
      }
    });
  });
};


export const uploadWxImage = (localId: string): Promise<string> => {
  return new Promise((resolve: any, reject: any) => {
    wx.uploadImage({
      localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 0, // 默认为1，显示进度提示
      success: (res: any) => {
        let serverId = res.serverId; // 返回图片的服务器端ID
        resolve(serverId);
      },
      fail: (reason: any) => {
        reject(reason);
      }
    });
  });
};

export const uploadToQiniu = async (file: any, key: string, token: string): Promise<string> => {
  let url = 'https://up.qbox.me';
  let form = new FormData();
  if (key) {
    form.append('key', key);
  }
  form.append('token', token);
  form.append('file', file);
  try {
    let res = await post(url, form, {withCredentials: false});
    let data = res.data;
    let imageKey = data.key;
    return imageKey;
  } catch (e) {
    throw e;
  }
};
