import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {TalkService} from "../../shared/api/talk/talk.api";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {TalkInfoModel, TalkCommentModel} from "../../shared/api/talk/talk.model";
import {UtilsService} from "../../shared/utils/utils";
import {VideoInfo, VideoPlayerOption} from "../../shared/video-player/video-player.model";
import {VideoPlayerComponent} from "../../shared/video-player/video-player.component";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {ShareBridge} from "../../shared/bridge/share.interface";
import {TitleService} from "../../shared/title/title.service";
import {AuthBridge} from "../../shared/bridge/auth.interface";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";

import { AnalyticsService, OnlineService, OnlineParams, OnlineInfo, MediaInfo } from "../../shared/analytics/analytics.service"

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
  $toolBar: any;
  isToolbarShow = false;
  originY = 0;
  isOnScreen = UtilsService.isOnLargeScreen;
  isLandscape = false;
  routeSub: Subscription;
  hasMoreComments: boolean;
  commentSize = 20;
  isVideoCoverShown = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('videoPlayer') player: VideoPlayerComponent;
  private onlineService: OnlineService;

  constructor(private route: ActivatedRoute, private router: Router,
              private talkApiService: TalkService, private shareBridge: ShareBridge,
              private titleService: TitleService, private authBridge: AuthBridge,
              private analytics: AnalyticsService) {
  }

  ngOnInit() {
    this.markOnline();

    this.id = this.route.snapshot.params['id'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.getTalkInfo().finally(() => {
      this.onlineService.start()
    });

    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.comments = [];
        this.listComments();
      }
    });
  }

  resetDefaultBackground() {
    this.talkInfo.coverUrl = '/assets/img/default-cover.jpg';
    this.talkInfo.coverSmallUrl = '/assets/img/default-cover.jpg';
    this.talkInfo.coverThumbnailUrl = '/assets/img/default-cover.jpg';
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.onlineService) this.onlineService.destroy();
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

  getTalkInfo() {
    this.isLoading = true;
    return this.talkApiService.getTalkInfo(this.id).then(talkInfo => {
      this.talkInfo = talkInfo;

      if (talkInfo.media.hasVideo) {
        this.videoOption = new VideoPlayerOption(false, !UtilsService.isiOS && !UtilsService.isAndroid);
        this.videoInfo = new VideoInfo('', talkInfo.media.mp4_sd, talkInfo.media.mp4_hd, talkInfo.media.mp4);

        // 横竖屏polyfill
        System.import('o9n').then(o9n => {
          this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && UtilsService.isViewportLandscape;
          o9n.orientation.onchange = (evt) => this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && UtilsService.isViewportLandscape;
        });
      }

      this.setShareInfo(talkInfo);
      this.titleService.set(talkInfo.subject);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  setShareInfo(talkInfo: TalkInfoModel) {
    let shareTitle = talkInfo.subject;
    let shareDesc = talkInfo.desc;
    let shareCover = talkInfo.coverThumbnailUrl;
    let shareUrl = `${location.protocol}//${location.hostname}${this.router.url}`;
    this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareUrl, this.id);
  }

  listComments(marker = '') {
    this.isCommentLoading = true;

    marker = marker ? `$lt${marker}` : '';

    this.talkApiService.listComments(this.id, this.commentSize+1, marker).then(comments => {
      if (comments.length === this.commentSize+1) {
        this.hasMoreComments = true;
        comments.pop();
      } else {
        this.hasMoreComments = false;
      }

      for (let item of comments) {
        this.comments.push(item);
      }
    }).finally(() => {
      this.isCommentLoading = false;
    })
  }

  checkSignIn(to?: string) {
    if (!this.userInfo) {
      this.authBridge.auth(to);
      return false;
    }

    return true;
  }

  favorite() {
    if (!this.checkSignIn()) return;

    if (this.isFavoriting) return;

    this.talkInfo.isFavorited = true;
    this.isFavoriting = true;

    this.talkApiService.favorite(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.isFavoriting = false;
    }).finally(() => {
      this.isFavoriting = false;
    });
  }

  unfavorite() {
    if (!this.checkSignIn()) return;

    if (this.isFavoriting) return;

    this.talkInfo.isFavorited = false;
    this.isFavoriting = true;

    this.talkApiService.unfavorite(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.talkInfo.isFavorited = true;
    }).finally(() => {
      this.isFavoriting = false;
    });
  }

  praise() {
    if (!this.checkSignIn()) return;

    if (this.isPraising) return;

    this.talkInfo.isPraised = true;
    this.talkInfo.praiseTotal+=1;
    this.isPraising = true;

    this.talkApiService.praise(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.talkInfo.isPraised = false;
      this.talkInfo.praiseTotal-=1;
    }).finally(() => {
      this.isPraising = false;
    });
  }

  unpraise() {
    if (!this.checkSignIn()) return;

    if (this.isPraising) return;

    this.talkInfo.isPraised = false;
    this.talkInfo.praiseTotal > 0 ? this.talkInfo.praiseTotal-=1 : 0;
    this.isPraising = true;

    this.talkApiService.unpraise(this.id).then(() => {
      this.talkApiService.getTalkInfo(this.id, true);
    }, () => {
      this.talkInfo.isPraised = true;
      this.talkInfo.praiseTotal+=1;
    }).finally(() => {
      this.isPraising = false;
    });
  }

  gotoComment(id?: string, nick?: string, content?: string) {
    let uriTree = this.router.createUrlTree([`talks/${this.id}/post-comment`]);
    let path = this.router.serializeUrl(uriTree);
    if (!this.checkSignIn(`${location.protocol}//${location.hostname}${path}`)) return;

    let queryParams: any = {title: encodeURIComponent(this.talkInfo.subject)};

    if (id && nick && content) {
      queryParams.request = encodeURIComponent(JSON.stringify({id: id, nick: nick, content: content}));
    }

    this.router.navigate([`/talks/${this.id}/post-comment`], {queryParams: queryParams});
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
    }

    if (e.type === 'load' && this.videoOption.isAutoPlay) {
      this.isVideoCoverShown = false;
    }
  }
}
