import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {LiveService} from '../../shared/api/live/live.service';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {ShareApiService} from '../../shared/api/share/share.api';
import {UserInfoService} from '../../shared/api/user-info/user-info.service';
import {OperationTipsService} from '../../shared/operation-tips/operation-tips.service';
import {UtilsService} from '../../shared/utils/utils';
import {IosBridgeService} from '../../shared/ios-bridge/ios-bridge.service';
import {PaidStatus} from './live-room-info.enums';
import {appConfig, host} from '../../../environments/environment';
import {TimelineComponent} from '../timeline/timeline.component';
import {VideoInfo, VideoPlayerOption} from '../../shared/video-player/video-player.model';
import {AnalyticsService, MediaInfo, OnlineParams, OnlineService} from '../../shared/analytics/analytics.service';
import {VideoPlayerComponent} from '../../shared/video-player/video-player.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';
import {StoreService} from '../../shared/store/store.service';
import {EventType, MqEvent} from '../../shared/mq/mq.service';
import {UserAnimEmoji} from '../../shared/praised-animation/praised-animation.model';
import {MessageApiService} from '../../shared/api/message/message.api';
import {VideoService} from '../../shared/video-player/video-player.service';
import {TimelineService} from '../timeline/timeline.service';
import {ShareBridge} from '../../shared/bridge/share.interface';
import {ModalService} from '../../shared/modal/modal.service';

@Component({
  templateUrl: './live-room-info.component.html',
  styleUrls: ['./live-room-info.component.scss'],
})

export class LiveRoomInfoRedBookComponent implements OnInit, OnDestroy {
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

  id: string;
  refreshInterval: any;
  eventSub: Subscription;
  videoInfo: VideoInfo;
  videoOption: VideoPlayerOption;
  isJoin = false;
  isVideoLoading = true;
  isVideoLoadError = false;
  isVideoCoverShown = true;
  routerSub: Subscription;
  videoVisableSub: Subscription;
  isLiveRoomVisable: boolean;
  hasGlobalPopup: boolean;
  @ViewChild('timeline') timeline: TimelineComponent;
  isLandscape = false;
  isOnLargeScreen = UtilsService.isOnLargeScreen;
  isiOS = UtilsService.isiOS;
  isAndroid = UtilsService.isAndroid;
  @ViewChild('videoPlayer') player: VideoPlayerComponent;
  private onlineService: OnlineService;
  alertMessage: SafeHtml;
  isAlertMessageShown = false;

  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private userInfoService: UserInfoService, private operationTipsService: OperationTipsService,
              private iosBridgeService: IosBridgeService, private shareService: ShareApiService, // 1
              private timelineService: TimelineService, private shareBridge: ShareBridge,
              private messageApiService: MessageApiService,
              private sanitizer: DomSanitizer,
              private analytics: AnalyticsService, private videoService: VideoService,
              private modalService: ModalService) {
  }

  ngOnInit() {
    this.liveId = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();
    this.initPayment();
    this.handlePaymentRedirect();

    this.route.snapshot.data['shareTitle'] = `${this.userInfo ? this.userInfo.nick : '我'}邀请你参加#${this.liveInfo.subject}#直播分享`;
    this.route.snapshot.data['shareDesc'] = this.liveInfo.desc;
    this.route.snapshot.data['shareCover'] = this.liveInfo.coverThumbnailUrl;
    this.route.snapshot.data['shareLink'] = this.getShareUri();

    this.getSubscribeLink();

    this.id = this.route.snapshot.params['id'];

    const alertMessageCache = StoreService.localStore.get('alertMessageCache') || {};
    if (this.liveInfo.alertMessage && this.liveInfo.alertMessage !== alertMessageCache[this.id]) {
      this.alertMessage = this.sanitizer.bypassSecurityTrustHtml(this.liveInfo.alertMessage);
      this.isAlertMessageShown = true;
    }

    this.setShareInfo();

    this.joinLiveRoom().then(() => {
      if (this.liveInfo.isTypeVideo()) {
        this.fetchStream();

        if (this.isiOS || this.isAndroid) {
          // 横竖屏polyfill
          System.import('o9n').then(o9n => {
            this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && UtilsService.isViewportLandscape;
            o9n.orientation.onchange = (evt) => {
              if (evt.target.type) {
                this.isLandscape = evt.target.type.indexOf('landscape') !== -1;
              } else {
                setTimeout(() => {
                  this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && UtilsService.isViewportLandscape;
                }, 100);
              }
            };
          });
        }
      }
    }).finally(() => {
      this.onlineService.start();
    });

    this.eventSub = this.timelineService.event$.subscribe((evt: MqEvent) => {
      if (evt.event === EventType.LiveClosed) {
        this.operationTipsService.popup('直播已结束');
        this.refreshLiveInfo().then(() => {
          this.getStreamInfo(false);
          this.timeline.checkHistoryTips();
        });
      }

      if (evt.event === EventType.LivePraise) {
        if (evt.info.user.uid === this.userInfo.uid) {
          return;
        }
        let userAnim = new UserAnimEmoji;
        userAnim.emoji = evt.info.emoji;
        userAnim.user = new UserInfoModel;
        this.liveInfo.praisedAnimations.push(userAnim);
      }
    });

    // 为了防止各种神奇浏览器的神奇播放器总是在最顶层, 打开子页面的时候, 把视频销毁
    this.routerSub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        let route = this.router.routerState.snapshot.root;

        while (route.firstChild) {
          route = route.firstChild;
        }

        this.isLiveRoomVisable = !route.component && route.parent.component === LiveRoomInfoRedBookComponent;

        if (this.isLiveRoomVisable) {
          this.setShareInfo();
        }
      }
    });

    this.videoVisableSub = this.videoService.$switchVideo.subscribe(hasGlobalPopup => this.hasGlobalPopup = hasGlobalPopup);

  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
    if (this.videoVisableSub) {
      this.videoVisableSub.unsubscribe();
    }

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    if (this.onlineService) {
      this.onlineService.destroy();
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
    let uriTree = this.router.createUrlTree([`/lives/${this.liveInfo.id}/red-book-info`], {queryParams: shareQuery});
    let path = this.router.serializeUrl(uriTree);
    return `${host.self}${path}`;
  }

  bookLive() {
    if (!this.checkLogin()) {
      return;
    }

    if (this.booking) {
      return;
    }

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
        this.showQrcode();
      } else if (this.userInfo.isSubscribed) {
        this.operationTipsService.popup('订阅成功');
      }
    }).finally(() => {
      this.booking = false;
    });
  }

  unbookLive() {
    if (this.booking) {
      return;
    }

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
    if (!this.checkMobileBinded()) {
      return;
    }
    if (this.paidStatus === this.paidEnums.Paying) {
      return;
    }

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
    if (!this.checkLogin()) {
      return;
    }

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
    if (this.isSubscribeLinkLoading) {
      return;
    }

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

  get hasPresent(): boolean {
    return this.liveInfo.isNeedPay && this.liveInfo.paid && !this.liveInfo.isPayByPresent();
  }

  gotoPresent() {
    if (!this.checkLogin()) {
      return;
    }

    this.router.navigate([`/lives/${this.liveInfo.id}/present`], {queryParams: {fromUid: this.userInfo.uid}});
  }

  go() {
    if (!this.checkLogin()) {
      return;
    }

    if (
      this.liveInfo.isNeedPay && !this.liveInfo.paid &&
      this.liveInfo.isAudience(this.userInfo.uid)
    ) {
      this.payLive();
    } else {
      this.gotoLive();
    }
  }

  markOnline() {
    const onlineParams = new OnlineParams();
    onlineParams.isPlaying = (): boolean => {
      if (!this.player) {
        return false;
      }
      return this.player.isPlaying();
    };
    onlineParams.getMediaInfo = (): MediaInfo => {
      if (!this.player) {
        return new MediaInfo();
      }
      return this.player.buildMediaInfo();
    };
    onlineParams.currentScroll = (): number => {
      return 0;
    };
    this.onlineService = this.analytics.onlineService(onlineParams);
  }

  refreshLiveInfo(): Promise<boolean> {
    return this.liveService.getLiveInfo(this.id, true).then(liveInfo => {
      let oldInfo = this.liveInfo;
      this.liveInfo = liveInfo;
      if (oldInfo) {
        this.liveInfo.praisedAnimations = oldInfo.praisedAnimations;
      }
      return;
    });
  }

  setShareInfo() {
    let shareTitle = `${this.userInfo.nick}正在参与激烈的讨论，邀请你加入#${this.liveInfo.subject}#`;
    let shareDesc = this.liveInfo.desc;
    let shareCover = this.liveInfo.coverThumbnailUrl;
    let shareUrl = this.getShareUri();
    this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareUrl, this.id);
  }
  getStreamInfo(needAutoPlay = true): Promise<void> {
    return this.liveService.processStreamInfo(this.liveInfo).then((videoInfo) => {
      this.videoInfo = null;
      let isLive = this.liveInfo.isStreamPushing();
      // ios及安卓不自动支持自动播放: https://webkit.org/blog/6784/new-video-policies-for-ios/
      let isAutoPlay = !UtilsService.isiOS && !UtilsService.isAndroid && needAutoPlay;
      if (videoInfo.hasVideo) {
        setTimeout(() => {
          this.videoInfo = videoInfo;
          this.videoOption = new VideoPlayerOption(isLive, isAutoPlay);
        });
      } else {
        this.isVideoCoverShown = true;
      }
      return;
    });
  }

  joinLiveRoom(): Promise<void> {
    return this.liveService.getLiveInfo(this.id, true).then(liveInfo => { // 发送加入话题间的请求。
      this.liveInfo = liveInfo;
      this.isJoin = true;
      return this.liveService.joinLive(this.id);
    });
  }

  fetchStream() {
    let promise = null;

    if (!this.isJoin) {
      promise = this.joinLiveRoom().then(() => {
        return this.getStreamInfo();
      });
    } else if (!this.videoInfo) {
      promise = this.getStreamInfo();
    }

    if (promise) {
      this.isVideoLoading = true;
      this.isVideoLoadError = false;

      promise.then(() => {
      }, (err) => {
        this.isVideoLoadError = true;
      }).finally(() => {
        this.isVideoLoading = false;
      });
    }
  }

  onClick() {
    if (this.isVideoLoadError) {
      this.operationTipsService.popup('视频源加载错误, 请重试');
      this.fetchStream();
    } else if (!this.videoInfo) {
      if (this.isVideoLoading) {
        this.operationTipsService.popup('视频源加载中, 请稍后播放');
      } else if (this.liveInfo.isCreated()) {
        this.operationTipsService.popup('直播尚未开始');
      } else {
        this.operationTipsService.popup('暂无视频源');
      }
    }
  }

  onVideoEvent(e: TcPlayerOptionListenerMsg) {
    if (e.type === 'play' || e.type === 'error') {
      this.isVideoCoverShown = false;
    }

    if (e.type === 'load' && this.videoOption.isAutoPlay) {
      this.isVideoCoverShown = false;
    }
  }

  closeAlert() {
    const alertMessageCache = StoreService.localStore.get('alertMessageCache') || {};
    alertMessageCache[this.id] = this.liveInfo.alertMessage;
    StoreService.localStore.set('alertMessageCache', alertMessageCache);
    this.isAlertMessageShown = false;
  }

}
