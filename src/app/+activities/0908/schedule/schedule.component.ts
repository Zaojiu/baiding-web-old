import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from "../../../shared/api/user-info/user-info.model";
import {UserInfoService} from "../../../shared/api/user-info/user-info.service";
import {LiveService} from "../../../shared/api/live/live.service";
import {OperationTipsService} from "../../../shared/operation-tips/operation-tips.service";
import {environment} from "../../../../environments/environment";

@Component({
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {
  userInfo: UserInfoModel;
  ids: string[] = [
    '59aea0c03ebb6f000109d629',
    '59aea3a931fdaf000107c9a1',
    '59aead5b31fdaf000107c9ae',
    '59aeb0083ebb6f000109d63e',
    '59aeb3193ebb6f000109d643',
    '59aeb6523ebb6f000109d64a',
    '59af6b4a31fdaf000107c9e9',
    '59af673b31fdaf000107c9e6',
  ];
  isAllSubscribed = false;
  isAllBtnPending = false;
  isLiveBtnPending: {[key: string]: boolean} = {};
  isLiveSubscribed: {[key: string]: boolean} = {};
  isQrcodeShown = false;
  timer: any;
  qrcode: string;

  constructor(private userInfoService: UserInfoService, private liveService: LiveService, private tipsService: OperationTipsService) {}

  ngOnInit() {
    this.userInfoService.getUserInfo().then(userInfo => {
      this.userInfo = userInfo;
    });

    this.ids.forEach((id) => {
      this.liveService.getLiveInfo(id).then(liveInfo => {
        this.isLiveSubscribed[liveInfo.id] = liveInfo.booked;
      });
    });

    System.import('yaqrcode').then(yaqrcode => {
      this.qrcode = yaqrcode(environment.config.wechatLink, {size: 240});
    });
  }

  checkIsSubscribed() {
    return this.userInfo && this.userInfo.isSubscribed;
  }

  showQrcode() {
    this.isQrcodeShown = true;

    // 轮询用户是否已订阅公众号
    this.timer = setInterval(() => {
      this.userInfoService.getUserInfo().then((userInfo) => {
        if (userInfo.isSubscribed) {
          this.closeQrcode();
          this.tipsService.popup('预约成功');
        }
        this.userInfo = userInfo;
      });
    }, 3 * 1000);
  }

  closeQrcode() {
    this.isQrcodeShown = false;
    clearInterval(this.timer);
  }

  bookLive(id: string) {
    if (!this.checkIsSubscribed()) {
      this.showQrcode();
      return;
    }

    this.isLiveBtnPending[id] = true;

    this.liveService.bookLive(id).then(() => {
      this.isLiveSubscribed[id] = true;
      this.tipsService.popup('预约成功');
    }).finally(() => {
      this.isLiveBtnPending[id] = false;
    });
  }

  bookAll() {
    if (!this.checkIsSubscribed()) {
      this.showQrcode();
      return;
    }

    this.isAllBtnPending = true;

    let promise = [];

    this.ids.forEach(id => {
      promise.push(this.liveService.bookLive(id));
    });

    Promise.all(promise).then(() => {
      this.isAllSubscribed = true;
      this.tipsService.popup('预约成功');
    }).finally(() => {
      this.isAllBtnPending = false;
    });
  }

  gotoLink() {
    location.href = '/lives';
  }
}
