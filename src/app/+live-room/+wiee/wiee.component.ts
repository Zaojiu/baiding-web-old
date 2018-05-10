import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {appConfig} from "../../../environments/environment";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";


@Component({
  templateUrl: './wiee.component.html',
  styleUrls: ['./wiee.component.scss'],
})

export class WieeComponent implements OnInit, OnDestroy {
  topLiveInfo: LiveInfoModel;
  livesList: LiveInfoModel[] = []
  timeNow = UtilsService.now.toString();
  liveTime: { [liveId: string]: string } = {};
  timer: any;
  userInfo: UserInfoModel;
  qrcode: string;
  liveId: string;
  from = '/lives';
  isInApp = UtilsService.isInApp;
  isInWechat = UtilsService.isInWechat;
  isLoading = false;
  booking = false;
  isQrcodeShown = false;
  isSubscribeLinkLoading = false;
  isSubscribeLinkError = false;

  constructor (private router: Router, private route: ActivatedRoute, private liveService: LiveService,
               private operationTipsService: OperationTipsService,
               private sanitizer: DomSanitizer, private userInfoService: UserInfoService) {
  }

  ngOnInit () {
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.route.snapshot.data['shareTitle'] = `${this.userInfo ? this.userInfo.nick : '我'}正在使用${appConfig.name}，发现更多经验分享`;

    this.isLoading = true;
    this.getLists('', 19).finally(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy () {
    clearInterval(this.timer);
  }

  gotoLiveRoomInfo(liveId: string) {
    this.router.navigate([`/lives/${liveId}/info`]);
  }

  gotoLiveRoom(liveId: string) {
    this.router.navigate([`/lives/${liveId}`]);
  }

  getLists(markerId: string, size: number): Promise<LiveInfoModel[]> {
    return this.liveService.listWiee(markerId, size + 1).then((livesList) => {
      if (livesList.length >= size + 1) {
        livesList.pop();
      }

      this.livesList = livesList.map( (i: LiveInfoModel) => {
        this.liveTime[i.id] = UtilsService.praseLiveTime(i);
        return i;
      });

      this.liveService.getLiveInfo(livesList[0].id, true).then( (liveData) => {
        this.topLiveInfo = liveData;
        console.log('LiveStatus' + this.topLiveInfo.isCreated());
      });

      this.getSubscribeLink();

      return livesList;
    });
  }

  //订阅直播通知函数
  bookLive () {
    if (this.userInfo) {
      if (this.booking || !this.livesList) {
        return;
      }

      this.booking = true;

      Promise.all<UserInfoModel, LiveInfoModel>([
        this.userInfoService.getUserInfo(false),
        this.liveService.bookLives(this.livesList),
      ]).then(result => {
        this.userInfo = result[0];
        this.topLiveInfo = result[1];

        if (!this.userInfo.isSubscribed && !this.isInApp) {
          this.showQrcode();
        } else if (!this.userInfo.isSubscribed && this.isInApp) {
          this.showQrcode();
        } else if (this.userInfo.isSubscribed) {
          this.operationTipsService.popup('订阅成功');
        }
      }).finally(() => {
        this.booking = false;
      });

    } else {
      this.toLogin();
    }
  }

  showQrcode() {
    if (!this.userInfo) {
      return;
    }

    this.isQrcodeShown = true;
    clearInterval(this.timer);

    // 轮询用户是否已订阅公众号
    this.timer = setInterval(() => {
      this.userInfoService.getUserInfo().then((userInfo) => {
        if (userInfo.isSubscribed) {
          this.closeQrcode();
          this.operationTipsService.popup('订阅成功');
          clearInterval(this.timer);
        }
        this.userInfo = userInfo;
      });
    }, 3 * 1000);
  }

  closeQrcode() {
    this.isQrcodeShown = false;
  }

  getSubscribeLink(): Promise<void> {
    if (this.isSubscribeLinkLoading)  return;
    if (!this.livesList) return;

    this.isSubscribeLinkLoading = true;
    this.isSubscribeLinkError = false;

    return this.liveService.getSubscribeLink(this.livesList[0].id).then(link => {
      this.qrcode = link;
      return;
    }).catch((err) => {
      this.isSubscribeLinkError = true;
      throw err;
    }).finally(() => {
      this.isSubscribeLinkLoading = false;
    });
  }

  toLogin () {
    this.router.navigate(['/signin'], {queryParams: {redirectTo: '/lives/wiee'}});
  }
}
