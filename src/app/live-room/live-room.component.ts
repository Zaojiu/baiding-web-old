import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {TimelineService} from './timeline/timeline.service';
import {LiveService} from '../shared/api/live/live.service';
import {LiveInfoModel} from '../shared/api/live/live.model';
import {UserInfoModel} from '../shared/api/user-info/user-info.model';
import {UserAnimEmoji} from '../shared/praised-animation/praised-animation.model';
import {MqEvent, EventType} from '../shared/mq/mq.service';
import {ShareBridge} from "../shared/bridge/share.interface";

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
              private timelineService: TimelineService, private shareBridge: ShareBridge) {
  }

  getShareUri(): string {
    let uriTree = this.router.createUrlTree([`/lives/${this.id}/info`]);
    let hash = this.router.serializeUrl(uriTree);
    let uri = location.href.replace(location.hash, `#${hash}`);
    return uri;
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

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.liveService.getLiveInfo(this.id, true, true); // 发送加入话题间的请求。

    this.route.snapshot.data['title'] = this.liveInfo.subject;
    this.shareBridge.setShareInfo(this.liveInfo.subject, this.liveInfo.desc, this.liveInfo.coverSmallUrl, this.getShareUri(), this.id);

    this.refreshInterval = setInterval(() => {
      this.refreshLiveInfo();
    }, 30 * 1000);

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
