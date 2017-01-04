import {Component, OnInit, OnDestroy} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {ShareApiService} from '../../shared/api/share/share.api';
import {environment} from "../../../environments/environment";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {UtilsService} from "../../shared/utils/utils";

@Component({
  templateUrl: './live-room-info.component.html',
  styleUrls: ['./live-room-info.component.scss'],
})

export class LiveRoomInfoComponent implements OnInit, OnDestroy {
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  isQrcodeShown = false;
  qrcode: string;
  timer: any;
  inApp = UtilsService.isInApp;

  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private userInfoService: UserInfoService, private shareService: ShareApiService, private operationTipsService: OperationTipsService) {
  }

  ngOnInit() {
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.shareService.accessSharedByRoute(this.route);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  bookLive() {
    this.liveService.bookLive(this.liveInfo.id).then(liveInfo => {
      this.liveInfo = liveInfo;
      if (!this.userInfo.isSubscribed) {
        this.operationTipsService.popup('请扫描二维码进行订阅');
        this.showQrcode();
      } else {
        this.operationTipsService.popup('订阅成功');
      }
    });
  }

  unbookLive() {
    this.liveService.unbookLive(this.liveInfo.id).then(liveInfo => {
      this.liveInfo = liveInfo;
      this.operationTipsService.popup('您已取消订阅');
    });
  }

  gotoLive() {
    this.router.navigate([`lives/${this.liveInfo.id}`]);
  }

  showQrcode() {
    this.isQrcodeShown = true;

    this.timer = setInterval(() => {
      this.userInfoService.getUserInfo(true).then((userInfo) => {
        if (userInfo.isSubscribed) this.closeQrcode();
        this.userInfo = userInfo;
      });
    }, 3 * 1000);

    System.import('yaqrcode').then(yaqrcode => {
      this.qrcode = yaqrcode(environment.config.wechatLink, {size: 130});
    });
  }

  closeQrcode() {
    this.isQrcodeShown = false;
    clearInterval(this.timer);
  }

  copyToClipboard(text) {
    // TODO need ios copy interface
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }
}
