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
import {InviteApiService} from "../../shared/api/invite/invite.api";
import {AudienceInvitationModel} from "../../shared/api/invite/invite.model";
import {host} from "../../../environments/environment";

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
  audienceListInvitations: AudienceInvitationModel[];
  isInWechat = UtilsService.isInWechat;
  btnText = '进入话题间';
  isSubscribeLinkLoading = false;
  isSubscribeLinkError = false;
  booking = false;
  originFee: string;

  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private userInfoService: UserInfoService, private operationTipsService: OperationTipsService,
              private iosBridgeService: IosBridgeService, private shareService: ShareApiService,
              private inviteApiService: InviteApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.initPayment();

    this.route.snapshot.data['shareTitle'] = `${this.userInfo.nick}邀请你参加#${this.liveInfo.subject}#直播分享`;
    this.route.snapshot.data['shareDesc'] = this.liveInfo.desc;
    this.route.snapshot.data['shareCover'] = this.liveInfo.coverThumbnailUrl;
    this.route.snapshot.data['shareLink'] = this.getShareUri();

    // this.shareService.accessSharedByRoute(this.route);

    this.inviteApiService.audienceListInvitations(this.liveId).then((res) => {
      this.audienceListInvitations = res;
    });

    this.getSubscribeLink();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  initPayment() {
    let payResult = this.route.snapshot.params['payResult'];
    if (payResult === 'success') this.paidStatus = this.paidEnums.Success;
    this.originFee = '';

    if (
      this.liveInfo.isNeedPay &&
      !this.liveInfo.paid &&
      this.liveInfo.isAudience(this.userInfo.uid)
    ) {
      if (this.userInfo.isMember) {
        if (this.liveInfo.memberFee.value === 0) {
          this.btnText = `会员免费`;
          if (this.liveInfo.originFee.value && this.liveInfo.originFee.value !== this.liveInfo.memberFee.value) {
            this.originFee = this.liveInfo.originFee.toYuan();
          }
        } else {
          this.btnText = `会员价: ${this.liveInfo.memberFee.toYuan()}`;
        }
      } else {
        if (this.liveInfo.totalFee.value === 0) {
          this.btnText = `限时免费`;
          if (this.liveInfo.originFee.value && this.liveInfo.originFee.value !== this.liveInfo.totalFee.value) {
            this.originFee = this.liveInfo.originFee.toYuan();
          }
        } else {
          this.btnText = `支付: ${this.liveInfo.totalFee.toYuan()}`;
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
        this.paidResult = '订单已关闭，请重新购买';
        break;
      case 'other error':
        this.paidStatus = this.paidEnums.Failure;
        this.paidResult = '下单失败，请联系我们';
        break;
    }
  }

  closePayment() {
    this.paidStatus = this.paidEnums.None;
    clearInterval(this.timer);
  }

  payLive() {
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

  go() {
    if (
      this.liveInfo.isNeedPay &&
      !this.liveInfo.paid &&
      this.liveInfo.isAudience(this.userInfo.uid)
    ) {
      this.payLive();
    } else {
      this.gotoLive();
    }
  }
}
