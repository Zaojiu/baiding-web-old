import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {TimelineService} from './timeline/timeline.service';
import {LiveService} from '../shared/api/live/live.service';
import {LiveInfoModel} from '../shared/api/live/live.model';
import {TitleService} from '../shared/title/title.service';
import {UserInfoService} from '../shared/api/user-info/user-info.service';
import {UserInfoModel} from '../shared/api/user-info/user-info.model';
import {UserAnimEmoji} from '../shared/praised-animation/praised-animation.model';
import {MqEvent, EventType} from '../shared/mq/mq.service';
import {ShareBridge} from "../shared/bridge/share.interface";
import {UtilsService} from "../shared/utils/utils";
import {LiveRoomService} from "./live-room.service";

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
              private timelineService: TimelineService, private titleService: TitleService,
              private shareBridge: ShareBridge, private liveRoomService: LiveRoomService) {
  }

  getShareUri(): string {
    let uriTree = this.router.createUrlTree([`/lives/${this.id}/info`]);
    let hash = this.router.serializeUrl(uriTree);
    let uri = location.href.replace(location.hash, `#${hash}`);
    return uri;
  }

  getLiveInfo(needRefresh?: boolean) {
    this.liveService.getLiveInfo(this.id, needRefresh).then(liveInfo => {

      let oldInfo = this.liveInfo;
      this.liveInfo = liveInfo;
      if (oldInfo) {
        this.liveInfo.praisedAnimations = oldInfo.praisedAnimations;
      }

      this.resetLiveRoom();
    });
  }

  resetLiveRoom() {
    this.titleService.set(this.liveInfo.subject);
    this.shareBridge.setShareInfo(this.liveInfo.subject, this.liveInfo.desc, this.liveInfo.coverSmallUrl, this.getShareUri(), this.id);
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.resetLiveRoom();

    this.refreshInterval = setInterval(() => {
      this.getLiveInfo(true);
    }, 10 * 1000);

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
    this.praisedSub.unsubscribe();

    clearInterval(this.refreshInterval);
  }
}
