import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {WechatConfigService} from "../../wechat/wechat.service";
import {environment} from "../../../../environments/environment";
import {ShareBridge} from "../share.interface";
import {SharePopupService} from "../../share-popup/share-popup.service";

import { AnalyticsService, SharePlatform } from "../../analytics/analytics.service"

declare var wx: any;

@Injectable()
export class WechatShareService implements ShareBridge {
  title: string;
  desc: string;
  cover: string;
  link: string;
  liveId?: string;

  constructor(private http: Http, private wechatConfigService: WechatConfigService,
              private analytics: AnalyticsService,
              private sharePopupService: SharePopupService) {
  }

  private _setShareInfo(title: string, desc: string, cover: string, link: string, liveId?: string) {
    if (desc.length > 19) desc = `${desc.slice(0, 18)}...`;
    desc = `${desc}`;

    this.title = title;
    this.desc = desc;
    this.cover = cover;
    this.link = link;
    this.liveId = liveId;

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
        this.analytics.eventShare(SharePlatform.wechatTimeline);
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
        this.analytics.eventShare(SharePlatform.wechatFriend);
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
        this.analytics.eventShare(SharePlatform.qq);
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
        this.analytics.eventShare(SharePlatform.weibo);
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
        this.analytics.eventShare(SharePlatform.qzone);
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

  setShareInfo(title: string, desc: string, cover: string, link: string, liveId?: string): Promise<void> {
    return this.wechatConfigService.init().then(() => {
      this._setShareInfo(title, desc, cover, link, liveId);
      return;
    });
  }

  share() {
    this.sharePopupService.popup();
  }
}
