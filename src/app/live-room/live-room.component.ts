import {Component, OnInit, OnDestroy} from '@angular/core';
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

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
              private timelineService: TimelineService, private shareBridge: ShareBridge,
              private shareService: ShareApiService, private messageApiService: MessageApiService) {
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
    });
  }

  getShareUri(): string {
    let shareQuery = this.shareService.makeShareQuery('streams', this.liveInfo.id);
    let uriTree = this.router.createUrlTree([`lives/${this.id}/info`], {queryParams: shareQuery});
    let path = this.router.serializeUrl(uriTree);
    return `${location.protocol}//${location.hostname}${path}`;
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.route.snapshot.data['title'] = this.liveInfo.subject; // 设置页面标题
    this.liveService.getLiveInfo(this.id, true, true); // 发送加入话题间的请求。
    this.setShareInfo(); // 设置分享参数等。
    this.shareService.accessSharedByRoute(this.route); // 跟踪分享路径。
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
  }

  ngOnDestroy() {
    if (this.praisedSub) this.praisedSub.unsubscribe();

    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }
}
