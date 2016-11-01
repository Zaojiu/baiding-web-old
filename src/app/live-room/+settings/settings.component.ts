import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {MqEvent, EventType} from "../../shared/mq/mq.service";
import {TimelineService} from '../../live-room/timeline/timeline.service';
import {LiveStatus} from "../../shared/api/live/live.enums";
import {WechatService} from "../../shared/wechat/wechat.service";

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})

export class SettingsComponent implements OnInit {
  liveId: string;
  liveInfo: LiveInfoModel;
  unreadCount = 0;
  liveStatusEnums = LiveStatus;

  constructor(private route: ActivatedRoute, private router: Router,
              private liveService: LiveService,
              private timelineService: TimelineService, private wechatService: WechatService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.timelineService.startReceive(this.liveId);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEventsReturn(evt));
  }

  get audioAutoPlay() {
    return this.liveService.isAudioAutoPlay(this.liveId);
  }

  set audioAutoPlay(result: boolean) {
    this.liveService.toggleAudioAutoPlay(this.liveId);
  }

  get isAdmin() {
    return this.liveService.isAdmin(this.liveId);
  }

  onReceivedEventsReturn(evt: MqEvent) {
    if (evt.event === EventType.LiveMsgUpdate) {
      this.unreadCount++;
    }
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.liveId]);
  }

  goInvitation() {
    this.router.navigate([`/lives/${this.liveId}/invitation`]);
  }

  closeWindow() {
    this.wechatService.closeWindow();
  }

  closeLive() {
    this.liveService.closeLive(this.liveId);
    this.liveService.getLiveInfo(this.liveId, true).then(liveInfo => this.liveInfo = liveInfo);
  }
}
