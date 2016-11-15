import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {WechatConfigService} from "../../wechat/wechat.service";
import {environment} from "../../../../environments/environment";
import {ShareBridge} from "../share.interface";

declare var wx: any;

@Injectable()
export class WechatShareService implements ShareBridge {
  constructor(private http: Http, private wechatConfigService: WechatConfigService) {
  }

  private setShare(title: string, desc: string, cover: string, link: string, liveId?: string) {
    if (desc.length > 19) desc = `${desc.slice(0, 18)}...`;
    desc = `${desc}#白丁直播#`;

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareQQ({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareWeibo({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareQZone({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId)
      },
      cancel: () => {
      }
    })
  }

  private confirmShare(liveId: string): Promise<void> {
    let url = `${environment.config.host.io}/api/live/streams/${liveId}/share`;

    return this.http.post(url, null).toPromise().then(res => {
    });
  }

  share(title: string, desc: string, cover: string, link: string, liveId?: string): Promise<void> {
    if (this.wechatConfigService.hasInit) {
      this.setShare(title, desc, cover, link, liveId);
      return Promise.resolve();
    } else {
      return this.wechatConfigService.initWechat().then(() => {
        this.setShare(title, desc, cover, link, liveId);
        return;
      });
    }
  }
}
