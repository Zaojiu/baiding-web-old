import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
import {environment} from "../../environments/environment";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {VideoPlayerComponent} from "../shared/video-player/video-player.component";
import {OperationTipsService} from "../shared/operation-tips/operation-tips.service";

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
  praisedSub: Subscription;
  videoInfo: VideoInfo;
  videoOption: VideoPlayerOption;
  isJoin = false;
  isVideoLoading = false;
  @ViewChild('videoPlayer') videoPlayer: VideoPlayerComponent;
  isDownloadTipsShow = UtilsService.isiOS && !UtilsService.isInApp;
  iosDownloadLink: SafeUrl;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
              private timelineService: TimelineService, private shareBridge: ShareBridge,
              private shareService: ShareApiService, private messageApiService: MessageApiService,
              private sanitizer: DomSanitizer, private tooltips: OperationTipsService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.route.snapshot.data['title'] = this.liveInfo.subject; // 设置页面标题
    this.setShareInfo(); // 设置分享参数等。
    this.shareService.accessSharedByRoute(this.route); // 跟踪分享路径。
    this.joinLiveRoom().then(() => {
        if (this.liveInfo.isTypeVideo() && !this.liveInfo.isCreated()) this.playVideo(true);
    });
    this.refreshInterval = setInterval(() => this.refreshLiveInfo(), 30 * 1000); // 每30s刷新一次liveInfo, 更新在线人数。

    this.praisedSub = this.timelineService.event$.subscribe((evt: MqEvent) => {
      if (evt.event != EventType.LivePraise) {
        return
      }
      if (evt.info.user.uid == this.userInfo.uid) {
        return
      }
      let userAnim = new UserAnimEmoji;
      userAnim.emoji = evt.info.emoji;
      userAnim.user = new UserInfoModel;
      this.liveInfo.praisedAnimations.push(userAnim);
    });

    this.iosDownloadLink = this.sanitizer.bypassSecurityTrustUrl(environment.config.iosDownloadLink);
  }

  ngOnDestroy() {
    if (this.praisedSub) this.praisedSub.unsubscribe();

    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  refreshLiveInfo() {
    this.liveService.getLiveInfo(this.id, true).then(liveInfo => {
      let oldInfo = this.liveInfo;
      this.liveInfo = liveInfo;
      if (oldInfo) {
        this.liveInfo.praisedAnimations = oldInfo.praisedAnimations;
      }
    });
  }

  setShareInfo() {
    this.getLatestTextMessage().then(latestText => {
      let shareTitle = `${this.userInfo.nick}正在参与激烈的讨论，邀请你加入#${this.liveInfo.subject}#`;
      let shareDesc = latestText;
      let shareCover = this.liveInfo.coverThumbnailUrl;
      let shareUrl = this.getShareUri();
      this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareUrl, this.id);
    });
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
    let uriTree = this.router.createUrlTree([`lives/${this.id}/info`], {queryParams: shareQuery});
    let path = this.router.serializeUrl(uriTree);
    return `${location.protocol}//${location.hostname}${path}`;
  }

  getStreamInfo(): Promise<void> {
    return this.liveService.processStreamInfo(this.liveInfo).then((videoInfo) => {
      this.videoInfo = videoInfo;
      let hasProgressBar = this.videoInfo && !this.videoInfo.hasRtmp;
      this.videoOption = new VideoPlayerOption(hasProgressBar);
      return;
    });
  }

  joinLiveRoom(): Promise<void> {
    return this.liveService.getLiveInfo(this.id, true, true).then(liveInfo => { // 发送加入话题间的请求。
      this.liveInfo = liveInfo;
      this.isJoin = true;
      return;
    });
  }

  playVideo(isAutoPlay = false) {
    let promise = null;

    if (!this.isJoin) {
      promise = this.joinLiveRoom().then(() => {
        return this.getStreamInfo();
      });
    } else if (!this.videoInfo || !this.videoInfo.hasVideo) {
      promise = this.getStreamInfo();
    }

    if (promise) {
      this.isVideoLoading = true;

      promise.then(() => {
        if (!this.videoInfo || !this.videoInfo.hasVideo) {
          if (this.liveInfo.isCreated()) {
            if (!isAutoPlay) this.tooltips.popup('直播尚未开始');
          } else {
            if (!isAutoPlay) this.tooltips.popup('暂无视频源, 请稍后重试');
          }
        } else {
          setTimeout(() => this.videoPlayer.play());
        }
      }).finally(() => {
        this.isVideoLoading = false;
      });
    } else {
      setTimeout(() => this.videoPlayer.play());
    }
  }
}
