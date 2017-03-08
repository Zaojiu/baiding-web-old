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
import {IosBridgeService} from "../../shared/ios-bridge/ios-bridge.service";
import {PaidStatus} from "./live-room-info.enums";
import {InviteApiService} from "../../shared/api/invite/invite.api";
import {AudienceInvitationModel} from "../../shared/api/invite/invite.model";
import {PayBridge} from "../../shared/bridge/pay.interface";

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
  paidShown = false;
  paidEnums = PaidStatus;
  paidStatus = PaidStatus.None;
  inApp = UtilsService.isInApp;
  liveId: string;
  audienceListInvitations: AudienceInvitationModel[];
  isInWechat = UtilsService.isInWechat;
  lockPayClick = false;

  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private userInfoService: UserInfoService, private operationTipsService: OperationTipsService,
              private iosBridgeService: IosBridgeService, private shareService: ShareApiService,
              private inviteApiService: InviteApiService, private payBridge: PayBridge) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    if (this.liveInfo.paid) this.paidStatus = PaidStatus.Completed;

    let payResult = this.route.snapshot.params['payResult'];
    if (payResult === 'success') {
      this.paidShown = true;
    }

    this.route.snapshot.data['title'] = this.liveInfo.subject; // 设置页面标题
    this.route.snapshot.data['shareTitle'] = `${this.userInfo.nick}邀请你参加#${this.liveInfo.subject}#直播分享`;
    this.route.snapshot.data['shareDesc'] = this.liveInfo.desc;
    this.route.snapshot.data['shareCover'] = this.liveInfo.coverThumbnailUrl;
    this.route.snapshot.data['shareLink'] = this.getShareUri();

    this.shareService.accessSharedByRoute(this.route);

    this.inviteApiService.audienceListInvitations(this.liveId).then((res) => {
      this.audienceListInvitations = res;
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  getShareUri(): string {
    let shareQuery = this.shareService.makeShareQuery('streams', this.liveInfo.id);
    let uriTree = this.router.createUrlTree([`lives/${this.liveInfo.id}/info`], {queryParams: shareQuery});
    let path = this.router.serializeUrl(uriTree);
    return `${location.protocol}//${location.hostname}${path}`;
  }

  bookLive() {
    this.liveService.bookLive(this.liveInfo.id).then(liveInfo => {
      this.liveInfo = liveInfo;
      if (!this.userInfo.isSubscribed && !this.inApp) {
        this.operationTipsService.popup('请长按识别二维码进行订阅');
        this.showQrcode();
      } else if (!this.userInfo.isSubscribed && this.inApp) {
        this.showQrcode()
      } else if (this.userInfo.isSubscribed) {
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

  payLive() {
    if (this.lockPayClick) return;

    this.lockPayClick = true;

    this.payBridge.pay(this.liveId).then(result => {
      this.paidStatus = this.paidEnums.Completed;
      this.liveService.getLiveInfo(this.liveId, true);
      this.paidShown = true;
    }, (reason) => {
      if (reason === 'cancel') {
        this.paidStatus = this.paidEnums.None;
        this.paidShown = false;
      } else if (reason === 'timeout') {
        this.operationTipsService.popup("支付超时，请重新支付");
        this.paidStatus = this.paidEnums.Failure;
        this.paidShown = true;
      } else {
        this.paidStatus = this.paidEnums.Failure;
        this.paidShown = true;
      }
    }).finally(() => {
      this.lockPayClick = false
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
    this.paidShown = false;
    clearInterval(this.timer);
  }


  copyToClipboard(text: string) {
    this.iosBridgeService.copyText(text).then(() => {
      this.operationTipsService.popup('复制成功');
      this.closeQrcode();
    });
  }
}
