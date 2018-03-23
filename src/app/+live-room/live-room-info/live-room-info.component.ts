import {Component, OnInit, OnDestroy} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {ShareApiService} from '../../shared/api/share/share.api';
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {UtilsService} from "../../shared/utils/utils";
import {IosBridgeService} from "../../shared/ios-bridge/ios-bridge.service";
import {PaidStatus} from "./live-room-info.enums";
import {appConfig, host} from "../../../environments/environment";
import {ModalService} from "../../shared/modal/modal.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ModalLink} from "../../shared/modal/modal.model";

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
  paidEnums = PaidStatus;
  paidStatus = PaidStatus.None;
  paidResult = '';
  inApp = UtilsService.isInApp;
  liveId: string;
  isInWechat = UtilsService.isInWechat;
  btnText = '进入话题间';
  isSubscribeLinkLoading = false;
  isSubscribeLinkError = false;
  booking = false;
  originFee: string;
  themeElem = null;
  isDownloadTipsShow = !UtilsService.isAndroid && !UtilsService.isInApp;

  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private sanitizer: DomSanitizer,
              private userInfoService: UserInfoService, private operationTipsService: OperationTipsService,
              private modalService: ModalService, private iosBridgeService: IosBridgeService, private shareService: ShareApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();
    if (this.liveInfo.themeCss) {
      this.themeElem = UtilsService.insertStyleElemIntoHead(this.liveId, this.liveInfo.themeCss);
    }

    this.initPayment();
    this.handlePaymentRedirect();

    this.route.snapshot.data['shareTitle'] = `${this.userInfo ? this.userInfo.nick : '我'}邀请你参加#${this.liveInfo.subject}#直播分享`;
    this.route.snapshot.data['shareDesc'] = this.liveInfo.desc;
    this.route.snapshot.data['shareCover'] = this.liveInfo.coverThumbnailUrl;
    this.route.snapshot.data['shareLink'] = this.getShareUri();

    // this.shareService.accessSharedByRoute(this.route);

    this.getSubscribeLink();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.themeElem) {
      this.themeElem.remove();
    }
  }

  handlePaymentRedirect() {
    const payResult = this.route.snapshot.queryParams['payResult'];
    if (payResult) {
      if (payResult === 'success') {
        this.handlePayResult('');
      } else if (payResult === 'cancel') {
        this.handlePayResult('cancel');
      } else {
        this.handlePayResult('fail');
        console.error(decodeURIComponent(payResult));
      }
    }
  }

  initPayment() {
    this.originFee = '';

    if (
      this.liveInfo.isNeedPay && !this.liveInfo.paid &&
      this.userInfo &&
      this.liveInfo.isAudience(this.userInfo.uid)
    ) {
      if (this.userInfo.isMember) {
        if (this.liveInfo.memberFee.value === 0) {
          this.btnText = `会员免费`;
        } else {
          this.btnText = `会员价: ${this.liveInfo.memberFee.toYuan()}`;
        }

        if (this.liveInfo.originFee.value && this.liveInfo.originFee.value !== this.liveInfo.memberFee.value) {
          this.originFee = this.liveInfo.originFee.toYuan();
        }
      } else {
        if (this.liveInfo.totalFee.value === 0) {
          this.btnText = `限时免费`;
        } else {
          this.btnText = `支付: ${this.liveInfo.totalFee.toYuan()}`;
        }

        if (this.liveInfo.originFee.value && this.liveInfo.originFee.value !== this.liveInfo.totalFee.value) {
          this.originFee = this.liveInfo.originFee.toYuan();
        }
      }
    } else {
      this.btnText = '进入话题间';
    }
  }

  getShareUri(): string {
    let shareQuery = this.shareService.makeShareQuery('streams', this.liveInfo.id);
    let uriTree = this.router.createUrlTree([`/lives/${this.liveInfo.id}/info`], {queryParams: shareQuery});
    let path = this.router.serializeUrl(uriTree);
    return `${host.self}${path}`;
  }

  bookLive() {
    if (!this.checkLogin()) return;

    if (this.booking) return;

    this.booking = true;

    Promise.all<UserInfoModel, LiveInfoModel>([
      this.userInfoService.getUserInfo(false),
      this.liveService.bookLive(this.liveInfo.id),
    ]).then(result => {
      this.userInfo = result[0];
      this.liveInfo = result[1];

      if (!this.userInfo.isSubscribed && !this.inApp) {
        this.showQrcode();
      } else if (!this.userInfo.isSubscribed && this.inApp) {
        this.showQrcode()
      } else if (this.userInfo.isSubscribed) {
        this.operationTipsService.popup('订阅成功');
      }
    }).finally(() => {
      this.booking = false;
    });
  }

  unbookLive() {
    if (this.booking) return;

    this.booking = true;

    this.liveService.unbookLive(this.liveInfo.id).then(liveInfo => {
      this.liveInfo = liveInfo;
      this.operationTipsService.popup('您已取消订阅');
    }).finally(() => {
      this.booking = false;
    });
  }

  handlePayResult(result: string) {
    switch (result) {
      case '':
        this.liveService.getLiveInfo(this.liveId, true).then(liveInfo => {
          this.liveInfo = liveInfo;
          this.paidStatus = this.paidEnums.Success;
          this.initPayment();
        });
        break;
      case 'cancel':
        this.paidStatus = this.paidEnums.None;
        break;
      case 'weixin_js_bridge_not_found':
        this.paidResult = '微信支付初始化失败，请刷新页面重试';
        this.paidStatus = this.paidEnums.Failure;
        break;
      case 'timeout':
        this.paidResult = '支付超时，请重新支付';
        this.paidStatus = this.paidEnums.Failure;
        break;
      case 'closed':
        this.paidStatus = this.paidEnums.Failure;
        this.paidResult = '订单已超时，请重新购买';
        break;
      case 'already paid':
        this.liveService.getLiveInfo(this.liveId, true).then(liveInfo => {
          this.liveInfo = liveInfo;
        });
        this.paidStatus = this.paidEnums.Failure;
        this.paidResult = '您已购买本话题间，无须再次支付';
        break;
      case 'fail':
        this.paidStatus = this.paidEnums.Failure;
        this.paidResult = '支付失败，请联系我们';
        break;
    }
  }

  closePayment() {
    this.paidStatus = this.paidEnums.None;
    clearInterval(this.timer);
  }

  checkLogin() {
    if (!this.userInfo) {
      this.router.navigate([`/signin`], {queryParams: {redirectTo: `/lives/${this.liveId}/info`}});
      return false;
    }

    return true;
  }

  checkMobileBinded() {
    if (this.userInfo && !this.userInfo.mobile.number) {
      this.router.navigate([`/signup`], {queryParams: {redirectTo: `/lives/${this.liveId}/info`}});
      return false;
    }

    return true;
  }

  payLive() {
    if (!this.checkMobileBinded()) return;
    if (this.paidStatus === this.paidEnums.Paying) return;

    this.paidStatus = this.paidEnums.Paying;

    this.liveService.pay(this.liveId).then(result => {
      this.handlePayResult(result);
    }, (reason) => {
      this.handlePayResult(reason);
    });
  }

  gotoLive() {
    this.router.navigate([`/lives/${this.liveInfo.id}`]);
  }

  showQrcode() {
    if (!this.checkLogin()) return;

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

  copyToClipboard(text: string) {
    this.iosBridgeService.copyText(text).then(() => {
      this.operationTipsService.popup('复制成功');
      this.closeQrcode();
    });
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

  gotoShareStar() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share-star`]);
  }

  get hasPresent(): boolean {
    return this.liveInfo.isNeedPay && this.liveInfo.paid && !this.liveInfo.isPayByPresent();
  }

  gotoPresent() {
    if (!this.checkLogin()) return;

    this.router.navigate([`/lives/${this.liveInfo.id}/present`], {queryParams: {fromUid: this.userInfo.uid}});
  }

  redirectToYingYongBao() {
    location.href = appConfig.iosDownloadLink;
  }

  go() {
    if (!this.checkLogin()) return;

    if (
      this.liveInfo.isNeedPay && !this.liveInfo.paid &&
      this.liveInfo.isAudience(this.userInfo.uid)
    ) {
      this.payLive();
    } else {
      this.gotoLive();
    }
  }
}
