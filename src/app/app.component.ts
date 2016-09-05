/*
 * Angular 2 decorators and services
 */
import { Component, OnInit } from '@angular/core';
import { BottomPopupSelectorService } from './shared/bottom-popup-selector/bottom-popup-selector.service';
import { UserInfoService } from './shared/user-info/user-info.service';
import { StoreService } from './shared/store/store.service';
import { WechatService } from './shared/wechat/wechat.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'bd-app',
  templateUrl: './app.component.html',
  providers: [ BottomPopupSelectorService, UserInfoService, StoreService, WechatService ]
})

export class App implements OnInit {
  constructor(private userInfoService: UserInfoService, private wechatService: WechatService) {}

  isInWechat(): boolean {
    return /micromessenger/i.test(window.navigator.userAgent);
  }

  ngOnInit() {
    const needWechatAuth = this.isInWechat();
    this.userInfoService.getUserInfo(needWechatAuth);
    this.wechatService.initWechat()
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
