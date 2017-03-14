import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {TalkService} from "../../shared/api/talk/talk.api";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {TalkInfoModel, TalkCommentModel} from "../../shared/api/talk/talk.model";
import {UtilsService} from "../../shared/utils/utils";
import {VideoInfo, VideoPlayerSrc} from "../../shared/video-player/video-player.model";
import {DomSanitizer} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {ShareBridge} from "../../shared/bridge/share.interface";
import {TitleService} from "../../shared/title/title.service";
import {AuthBridge} from "../../shared/bridge/auth.interface";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";

@Component({
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})

export class ArticleComponent implements OnInit, OnDestroy {
  id: string;
  userInfo: UserInfoModel;
  talkInfo: TalkInfoModel;
  videoInfo: VideoInfo;
  comments: TalkCommentModel[] = [];
  isLoading: boolean;
  isCommentLoading: boolean;
  isPraising: boolean;
  isFavoriting: boolean;
  @ViewChild('toolBar') toolBar: ElementRef;
  $toolBar: any;
  isToolbarShow = false;
  originY = 0;
  isOnScreen = UtilsService.isOnScreen;
  routeSub: Subscription;
  hasMoreComments: boolean;
  commentSize = 20;

  constructor(private route: ActivatedRoute, private router: Router,
              private talkApiService: TalkService, private sanitizer: DomSanitizer,
              private shareBridge: ShareBridge, private titleService: TitleService, private authBridge: AuthBridge) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.getTalkInfo();

    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.comments = [];
        this.listComments();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  getTalkInfo() {
    this.isLoading = true;
    this.talkApiService.getTalkInfo(this.id).then(talkInfo => {
      this.talkInfo = talkInfo;

      if (talkInfo.media.hasVideo) {
        let videos = [];
        if (talkInfo.media.mp4_sd) videos.push(new VideoPlayerSrc(this.sanitizer.bypassSecurityTrustUrl(talkInfo.media.mp4_sd), 'video/mp4'));
        if (talkInfo.media.mp4_hd) videos.push(new VideoPlayerSrc(this.sanitizer.bypassSecurityTrustUrl(talkInfo.media.mp4_hd), 'video/mp4'));
        if (talkInfo.media.mp4) videos.push(new VideoPlayerSrc(this.sanitizer.bypassSecurityTrustUrl(talkInfo.media.mp4), 'video/mp4'));
        this.videoInfo = new VideoInfo(videos);
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
    let shareCover = this.talkInfo.coverThumbnailUrl;
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

  checkSignIn() {
    if (!this.userInfo) {
      this.authBridge.auth(encodeURIComponent(location.href));
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
}
