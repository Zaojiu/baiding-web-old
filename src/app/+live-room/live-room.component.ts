import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, NavigationStart, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {TimelineService} from './timeline/timeline.service';
import {LiveService} from '../shared/api/live/live.service';
import {ShareApiService} from '../shared/api/share/share.api';
import {LiveInfoModel} from '../shared/api/live/live.model';
import {UserInfoModel} from '../shared/api/user-info/user-info.model';
import {UserAnimEmoji} from '../shared/praised-animation/praised-animation.model';
import {MqEvent, EventType} from '../shared/mq/mq.service';
import {ShareBridge} from '../shared/bridge/share.interface';
import {MessageApiService} from "../shared/api/message/message.api";
import {VideoInfo, VideoPlayerOption} from "../shared/video-player/video-player.model";
import {UtilsService} from "../shared/utils/utils";
import {host} from "../../environments/environment";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {OperationTipsService} from "../shared/operation-tips/operation-tips.service";
import {TimelineComponent} from "./timeline/timeline.component";
import {VideoService} from "../shared/video-player/video-player.service";
import {VideoPlayerComponent} from "../shared/video-player/video-player.component";
import {AnalyticsService, OnlineService, OnlineParams, MediaInfo} from "../shared/analytics/analytics.service"
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {StoreService} from "../shared/store/store.service";

@Component({
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.scss'],
})

export class LiveRoomComponent implements OnInit, OnDestroy {
  id: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  showInfo: boolean;
  isCommentOpened: boolean = true;
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
  themeElem = null;
  hiddenZj = false;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
              private timelineService: TimelineService, private shareBridge: ShareBridge,
              private shareService: ShareApiService, private messageApiService: MessageApiService,
              private sanitizer: DomSanitizer, private tooltips: OperationTipsService,
              private analytics: AnalyticsService, private videoService: VideoService,
              private userInfoService: UserInfoService) {
  }

  ngOnInit() {

    this.markOnline();

    // 监听路由变化, 刷新liveInfo
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(() => {
        this.refreshLiveInfo();
      });

    this.id = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();
    let routerName = this.route.snapshot.firstChild.data['name'];
    if (routerName !== 'invitation' && !this.canEnter()) {
      this.router.navigate([`/lives/${this.liveInfo.id}/info`]);
      return;
    }
    if (this.liveInfo.themeCss) {
      this.themeElem = UtilsService.insertStyleElemIntoHead(this.id, this.liveInfo.themeCss);
    }
    this.hiddenZj = UtilsService.isFuDan(this.id);
    const alertMessageCache = StoreService.localStore.get('alertMessageCache') || {};
    if (this.liveInfo.alertMessage && this.liveInfo.alertMessage !== alertMessageCache[this.id]) {
      this.alertMessage = this.sanitizer.bypassSecurityTrustHtml(this.liveInfo.alertMessage);
      this.isAlertMessageShown = true;
    }

    this.setShareInfo();
    // this.shareService.accessSharedByRoute(this.route); // 跟踪分享路径。

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
            }
          });
        }
      }
      if (!this.userInfo) {
        this.guestCounter();
      }
    }).finally(() => {
      this.onlineService.start();
    });
    this.refreshInterval = setInterval(() => this.refreshLiveInfo(), 120 * 1000); // 每30s刷新一次liveInfo, 更新在线人数。

    this.eventSub = this.timelineService.event$.subscribe((evt: MqEvent) => {
      if (evt.event === EventType.LiveClosed) {
        this.tooltips.popup('直播已结束');
        this.refreshLiveInfo().then(() => {
          this.getStreamInfo(false);
          this.timeline.checkHistoryTips();
        });
      }

      if (evt.event === EventType.LivePraise) {

        if (!this.userInfo) {
          return;
        }

        if (evt.info.user.uid == this.userInfo.uid) {
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

        while (route.firstChild) route = route.firstChild;

        this.isLiveRoomVisable = !route.component && route.parent.component === LiveRoomComponent;

        if (this.isLiveRoomVisable) this.setShareInfo();
      }
    });

    this.videoVisableSub = this.videoService.$switchVideo.subscribe(hasGlobalPopup => this.hasGlobalPopup = hasGlobalPopup);
  }

  ngOnDestroy() {
    if (this.themeElem != null) {
      this.themeElem.remove();
    }
    if (this.eventSub) this.eventSub.unsubscribe();

    if (this.videoVisableSub) this.videoVisableSub.unsubscribe();

    if (this.refreshInterval) clearInterval(this.refreshInterval);

    if (this.onlineService) this.onlineService.destroy();
  }

  canEnter(): boolean {
    if (this.liveInfo.isForMember) {
      if (!this.userInfo) {
        return false;
      }
      // 当前登录用户，是会员 或者是房主 或者是嘉宾
      if (this.liveInfo.isAdmin(this.userInfo.uid) || this.liveInfo.isVip(this.userInfo.uid) || this.userInfo.isMember) {
        return true;
      }
      return false;
    }
    return true;
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

      if (oldInfo) this.liveInfo.praisedAnimations = oldInfo.praisedAnimations;
      return;
    });
  }

  setShareInfo() {
    let shareTitle = `${this.userInfo ? this.userInfo.nick : '我'}邀请你收看#${this.liveInfo.subject}#`;
    let shareDesc = this.liveInfo.desc;
    let shareCover = this.liveInfo.coverThumbnailUrl;
    let shareUrl = this.getShareUri();
    this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareUrl, this.id);
  }

  getLatestTextMessage(marker = ''): Promise<string> {
    return this.messageApiService.listMessages(this.id, marker, 21).then(messages => {
        for (let message of messages) {
          if (message.isText() || message.isNice()) return message.content;
          if (message.isAudio() && message.audio.translateResult) return message.audio.translateResult;
        }

        if (messages.length < 21) return this.liveInfo.desc;

        return this.getLatestTextMessage(messages[messages.length - 1].id);
      }
    );
  }

  getShareUri(): string {
    let shareQuery = this.shareService.makeShareQuery('streams', this.liveInfo.id);
    let uriTree = this.router.createUrlTree([`/lives/${this.id}/info`], {queryParams: shareQuery});
    let path = this.router.serializeUrl(uriTree);
    return `${host.self}${path}`;
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
    return this.liveService.getLiveInfo(this.id).then(liveInfo => { // 发送加入话题间的请求。
      this.liveInfo = liveInfo;
      this.isJoin = true;
      return this.liveService.joinLive(this.id);
    });
  }

  guestCounter(): Promise<void> {
    return this.liveService.getLiveInfo(this.id).then(liveInfo => {
      this.liveInfo = liveInfo;
      return this.liveService.Counter(this.id);
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
      this.tooltips.popup('视频源加载错误, 请重试');
      this.fetchStream();
    } else if (!this.videoInfo) {
      if (this.isVideoLoading) {
        this.tooltips.popup('视频源加载中, 请稍后播放');
      } else if (this.liveInfo.isCreated()) {
        this.tooltips.popup('直播尚未开始');
      } else {
        this.tooltips.popup('暂无视频源');
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
