import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {appConfig} from "../../../environments/environment";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";

declare var $: any;

@Component({
  templateUrl: './wiee.component.html',
  styleUrls: ['./wiee.component.scss'],
})

export class WieeComponent implements OnInit, OnDestroy {
  constructor (private router: Router, private route: ActivatedRoute, private liveService: LiveService,
               private operationTipsService: OperationTipsService,
               private sanitizer: DomSanitizer, private userInfoService: UserInfoService) {
  }

  livesList: LiveInfoModel[] = [];
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  covers: { [liveId: string]: SafeUrl } = {};
  liveTime: { [liveId: string]: string } = {};
  timeNow = UtilsService.now.toString();
  timer: any;
  userInfo: UserInfoModel;
  liveInfo: LiveInfoModel;
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

  ngOnInit () {
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.route.snapshot.data['shareTitle'] = `${this.userInfo ? this.userInfo.nick : '我'}正在使用${appConfig.name}，发现更多经验分享`;

    this.timer = setInterval(() => this.timeNow = UtilsService.now.toString(), 1000);

    this.isLoading = true;
    this.getLists('', 6).finally(() => {
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
    return this.liveService.listNow(markerId, size + 1).then((livesList) => {
      if (livesList.length >= size + 1) {
        livesList.pop();
      }

      this.scroller.appendData(livesList);

      for (let liveInfo of this.livesList) {
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(liveInfo.coverSmallUrl);
        this.liveTime[liveInfo.id] = UtilsService.praseLiveTime(liveInfo);
      }

      return livesList;
    });
  }

  //订阅直播通知函数
  bookLive () {
    if (this.userInfo) {
      this.operationTipsService.popup('WIEE直播尚未开通，暂无法订阅');
    } else {
      this.toLogin();
    }
  }

  showQrcode() {
    if (!this.userInfo) return;

    this.isQrcodeShown = true;

    // 轮询用户是否已订阅公众号
    this.timer = setInterval(() => {
      this.userInfoService.getUserInfo().then((userInfo) => {
        if (userInfo.isSubscribed) {
          this.closeQrcode();
          this.operationTipsService.popup('订阅成功');
        }
        this.userInfo = userInfo;
      });
    }, 3 * 1000);
  }

  closeQrcode() {
    this.isQrcodeShown = false;
  }

  getSubscribeLink(): Promise<void> {
    if (this.isSubscribeLinkLoading) return;

    this.isSubscribeLinkLoading = true;
    this.isSubscribeLinkError = false;

    return this.liveService.getSubscribeLink(this.liveId).then(link => {
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
