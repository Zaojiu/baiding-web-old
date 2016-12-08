import {Component, OnInit, OnDestroy} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {environment} from "../../../environments/environment";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";

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

  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  setNotification() {
    this.liveService.postLiveNotification(this.liveInfo.id).then(() => {
      this.refresh();
      if (!this.userInfo.isSubscribed) this.showQrcode();
    });
  }

  deleteNotification() {
    this.liveService.deleteLiveNotification(this.liveInfo.id).then(() => {
      this.refresh();
    });
  }

  refresh() {
    this.liveService.getLiveInfo(this.liveInfo.id, true).then(liveInfo => this.liveInfo = liveInfo);
  }

  gotoLive() {
    this.router.navigate([`/lives/${this.liveInfo.id}`]);
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
}
