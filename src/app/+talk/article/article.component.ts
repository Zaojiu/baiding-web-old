import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {TalkService} from "../../shared/api/talk/talk.api";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {TalkInfoModel, TalkCommentModel} from "../../shared/api/talk/talk.model";
import {UtilsService} from "../../shared/utils/utils";
import {VideoInfo, VideoPlayerOption} from "../../shared/video-player/video-player.model";
import {VideoPlayerComponent} from "../../shared/video-player/video-player.component";
import {Subscription} from "rxjs";
import {ShareBridge} from "../../shared/bridge/share.interface";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";

import {
  AnalyticsService,
  OnlineService,
  OnlineParams,
  MediaInfo
} from "../../shared/analytics/analytics.service"
import {ObjectService} from "../../shared/api/object/object.api";
import {ObjectModel} from "../../shared/api/object/object.model";

import {IosBridgeService} from "../../shared/ios-bridge/ios-bridge.service";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {host} from "../../../environments/environment";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {SinglePlayerComponent} from "../../shared/audio-player/single-player.component";

@Component({
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})

export class ArticleComponent implements OnInit, OnDestroy {
  id: string;
  userInfo: UserInfoModel;
  talkInfo: TalkInfoModel;
  videoInfo: VideoInfo;
  videoOption: VideoPlayerOption;
  comments: TalkCommentModel[] = [];
  isLoading: boolean;
  isCommentLoading: boolean;
  isPraising: boolean;
  isFavoriting: boolean;
  @ViewChild('toolBar') toolBar: ElementRef;
  @ViewChild('main') main: ElementRef;
  @ViewChild('commentTitle') commentTitle: ElementRef;
  $toolBar: any;
  isToolbarShow = false;
  originY = 0;
  isOnScreen = UtilsService.isOnLargeScreen;
  isLandscape = false;
  routeSub: Subscription;
  hasMoreComments: boolean;
  commentSize = 20;
  isVideoCoverShown = true;
  liveObject: ObjectModel;
  isiOS = UtilsService.isiOS;
  isAndroid = UtilsService.isAndroid && UtilsService.isInApp;
  isNewApp: boolean;
  closeVideo: boolean;
  isVideoEle: any;

  @ViewChild('container') container: ElementRef;
  @ViewChild('videoPlayer') player: VideoPlayerComponent;
  @ViewChild('audioPlayer') audioPlayer: SinglePlayerComponent;
  private onlineService: OnlineService;

  constructor(private route: ActivatedRoute, private router: Router,
              private talkApiService: TalkService, private shareBridge: ShareBridge,
              private analytics: AnalyticsService, private objectService: ObjectService,
              private iosBridge: IosBridgeService, private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.markOnline();
    this.isNewApp = UtilsService.isNewAppVersion('2.1.4');
    this.id = this.route.snapshot.params['id'];
    this.talkInfo = this.route.snapshot.data['talkInfo'];
    if (!this.talkInfo) return;
    // 在微信中，并且是会员专属视屏
    if (UtilsService.isInWechat && this.talkInfo.isForMember) {
      this.userInfo = this.userInfoService.getUserInfoCache(location.href);
    } else {
      this.userInfo = this.userInfoService.getUserInfoCache();
    }
    this.init();
  }

  init() {
    if (this.talkInfo.parentId) {
      this.objectService.getObject(this.talkInfo.parentId).then(liveObject => {
        this.liveObject = liveObject;
      });
    }

    if (this.talkInfo.media.hasVideo) {
      this.videoOption = new VideoPlayerOption(false, !UtilsService.isiOS && !UtilsService.isAndroid);
      this.videoInfo = new VideoInfo('', this.talkInfo.media.mp4_sd, this.talkInfo.media.mp4_hd, this.talkInfo.media.mp4);

      // 横竖屏polyfill
      System.import('o9n').then(o9n => {
        this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && UtilsService.isViewportLandscape;
        o9n.orientation.onchange = (evt) => this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && UtilsService.isViewportLandscape;
      });
    }

    this.setShareInfo(this.talkInfo);
    this.onlineService.start();

    let firstRefreshComment = true;
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.route.firstChild && !this.route.firstChild.firstChild) {
        this.refreshComments(!firstRefreshComment);
        if (firstRefreshComment) firstRefreshComment = false;
      }
    });

    if (UtilsService.isInApp) {
      this.iosBridge.onRefreshPage(() => {
        this.refreshComments();
      })
    }
  }

  ngAfterViewInit() {
    if (this.isVideoOverThree(this.talkInfo.media.duration)) {
      this.isVideoEle = document.getElementsByTagName('video')[0];
      this.isVideoEle.addEventListener('timeupdate', this.bindHandler.bind(this), false);
    }
  }

  bindHandler(event) {
    let _this = event.target;
    if (_this.currentTime > 180) {
      this.closeVideo = true;
      if (this.isVideoEle) {
        this.isVideoEle.removeEventListener('timeupdate', this.bindHandler.bind(this), false);
        this.isVideoEle = null;
      }
    }
  }

  isVideoOverThree(duration) {
    if ((UtilsService.isInApp && this.isNewApp) || !this.talkInfo.isForMember || (this.userInfo && this.userInfo.isMember)) {
      return false;
    }
    if (duration.minutes() >= 3) {
      return true;
    }
    if (duration.minutes() === 3 && duration.seconds() > 0) {
      return true;
    }
    return false;
  }

  gotoMember() {
    if (UtilsService.isInApp) {
      this.iosBridge.gotoMember();
      return;
    }
    location.href = `${host.self}/new-member/action`;
  }

  scrollToComment() {
    this.main.nativeElement.scrollTop = this.commentTitle.nativeElement.offsetTop;
  }

  refreshComments(needScrollToComment = true) {
    this.comments = [];
    this.listComments().then(() => {
      if (needScrollToComment) setTimeout(() => this.scrollToComment());
    });
  }

  resetDefaultBackground() {
    this.talkInfo.coverUrl = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.coverSmallUrl = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.coverThumbnailUrl = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.cover11Url = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.coverSmall11Url = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.coverThumbnail11Url = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.cover169Url = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.coverSmall169Url = `${host.assets}/assets/img/default-cover.jpg`;
    this.talkInfo.coverThumbnail169Url = `${host.assets}/assets/img/default-cover.jpg`;
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.onlineService) this.onlineService.destroy();
    if (this.isVideoEle) {
      this.isVideoEle.removeEventListener('timeupdate', this.bindHandler.bind(this), false);
    }
  }

  markOnline() {
    let onlineParams = new OnlineParams()
    onlineParams.isPlaying = (): boolean => {
      if (!this.player) {
        return false
      }
      return this.player.isPlaying()
    };
    onlineParams.getMediaInfo = (): MediaInfo => {
      if (!this.player) {
        return new MediaInfo()
      }
      return this.player.buildMediaInfo()
    };
    onlineParams.currentScroll = (): number => {
      return $(this.container.nativeElement).scrollTop()
    };
    this.onlineService = this.analytics.onlineService(onlineParams)
  }

  setShareInfo(talkInfo: TalkInfoModel) {
    let shareTitle = talkInfo.subject;
    let shareDesc = talkInfo.desc;
    let shareCover = talkInfo.coverThumbnailUrl;
    let shareUrl = `${host.self}${this.router.url}`;
    this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareUrl, this.id);
  }

  listComments(marker = '') {
    this.isCommentLoading = true;

    marker = marker ? `$lt${marker}` : '';

    return this.talkApiService.listComments(this.id, this.commentSize + 1, marker).then(comments => {
      if (comments.length === this.commentSize + 1) {
        this.hasMoreComments = true;
        comments.pop();
      } else {
        this.hasMoreComments = false;
      }

      for (let item of comments) {
        this.comments.push(item);
      }
      return;
    }).finally(() => {
      this.isCommentLoading = false;
    })
  }

  checkSignIn(to?: string) {
    if (!this.userInfo) {
      this.router.navigate(['/signin'], {queryParams: {redirectTo: to || location.href}});
      return false;
    }

    return true;
  }

  favorite() {
    if (!this.checkSignIn()) return;

    if (this.isFavoriting) return;

    this.talkInfo.isFavorited = true;
    this.isFavoriting = true;
    this.talkInfo.favoriteTotal += 1;

    this.talkApiService.favorite(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.isFavoriting = false;
      this.talkInfo.favoriteTotal -= 1;
    }).finally(() => {
      this.isFavoriting = false;
    });
  }

  unfavorite() {
    if (!this.checkSignIn()) return;

    if (this.isFavoriting) return;

    this.talkInfo.isFavorited = false;
    this.isFavoriting = true;
    this.talkInfo.favoriteTotal > 0 ? this.talkInfo.favoriteTotal -= 1 : 0;

    this.talkApiService.unfavorite(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.talkInfo.isFavorited = true;
      this.talkInfo.favoriteTotal += 1;
    }).finally(() => {
      this.isFavoriting = false;
    });
  }

  praise() {
    if (!this.checkSignIn()) return;

    if (this.isPraising) return;

    this.talkInfo.isPraised = true;
    this.talkInfo.praiseTotal += 1;
    this.isPraising = true;

    this.talkApiService.praise(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.talkInfo.isPraised = false;
      this.talkInfo.praiseTotal -= 1;
    }).finally(() => {
      this.isPraising = false;
    });
  }

  unpraise() {
    if (!this.checkSignIn()) return;

    if (this.isPraising) return;

    this.talkInfo.isPraised = false;
    this.talkInfo.praiseTotal > 0 ? this.talkInfo.praiseTotal -= 1 : 0;
    this.isPraising = true;

    this.talkApiService.unpraise(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.talkInfo.isPraised = true;
      this.talkInfo.praiseTotal += 1;
    }).finally(() => {
      this.isPraising = false;
    });
  }

  gotoComment(id?: string, nick?: string, content?: string) {
    let uriTree = this.router.createUrlTree([`/talks/${this.id}/post-comment`]);
    let path = this.router.serializeUrl(uriTree);
    let queryParams: any = {title: this.talkInfo.subject};
    // 判断是否在app中
    if (!UtilsService.isInApp) {
      // web判断是否登录
      if (!this.checkSignIn(`${host.self}${path}`)) {
        return;
      }
      // 判断是否为回复
      if (id && nick && content) {
        queryParams.request = JSON.stringify({id: id, nick: nick, content: content});
      }
      this.router.navigate([`/talks/${this.id}/post-comment`], {queryParams: queryParams});
    } else {
      // 判断是否为回复
      if (id && nick && content) {
        this.iosBridge.gotoTalksComment(JSON.stringify({
          title: this.talkInfo.subject,
          query: {
            id: id,
            nick: nick,
            content: content,
          }
        }));
      } else {
        // 在app中非回复评论由native控制
        return;
      }
    }
  }

  touchStart(e: TouchEvent) {
    if (this.toolBar && !this.$toolBar) this.$toolBar = $(this.toolBar.nativeElement);

    if (!this.$toolBar) return;

    this.originY = e.touches[0].clientY;
  }

  touchMove(e: TouchEvent) {
    if (!this.$toolBar) return;

    if (this.originY - e.touches[0].clientY > 10 && this.isToolbarShow) {
      this.toolbarHide();
      this.isToolbarShow = false;
    } else if (e.touches[0].clientY - this.originY > 10 && !this.isToolbarShow) {
      this.toolbarShow();
      this.isToolbarShow = true;
    }
  }

  toolbarShow() {
    this.$toolBar.css({'position': 'fixed', 'bottom': '-46px'}).animate({'bottom': '0px'}, 'fast');
  }

  toolbarHide() {
    this.$toolBar.animate({'bottom': '-46px'}, 'fast', () => {
      this.$toolBar.css({'bottom': '', 'position': ''});
    });
  }

  onVideoEvent(e: TcPlayerOptionListenerMsg) {
    if (e.type === 'play' || e.type === 'error') {
      this.isVideoCoverShown = false;

      if (this.audioPlayer && this.audioPlayer.isAudioPlaying) {
        this.audioPlayer.togglePlay();
      }
    }

    if (e.type === 'load' && this.videoOption.isAutoPlay) {
      this.isVideoCoverShown = false;
    }
  }

  onAudioEvent(e: { type: string, data: any }) {
    if (e.type === 'play') {
      if (this.player && this.player.isPlaying()) {
        this.player.pause();
      }
    }
  }

  gotoLive(id: string) {
    this.router.navigate([`/lives/${id}/info`]);
  }

  coverLoadError(liveInfo: LiveInfoModel) {
    liveInfo.coverSmallUrl = '/assets/img/default-cover.jpg'
  }
}
