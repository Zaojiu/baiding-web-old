import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {WechatConfigService} from "../../wechat/wechat.service";
import {ImageBridge} from "../image.interface";

declare var wx: any;

@Injectable()
export class WechatImageService implements ImageBridge {
  constructor(private wechatConfigService: WechatConfigService) {
  }

  private _chooseImages(count: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: count, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          resolve(localIds);
        },
        fail: (reason) => {
          reject(reason);
        }
      });
    });

  }

  chooseImages(count = 9): Promise<string[]> {
    if (this.wechatConfigService.hasInit) {
      return this._chooseImages(count);
    } else {
      return this.wechatConfigService.init().then(() => {
        return this._chooseImages(count);
      });
    }
  }

  uploadImage(localId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.uploadImage({
        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: (res) => {
          var serverId = res.serverId; // 返回图片的服务器端ID
          resolve(serverId);
        },
        fail: (reason) => {
          reject(reason);
        }
      });
    });
  }
}
