import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {MqEvent, EventType} from "../../shared/mq/mq.service";
import {TimelineService} from '../../live-room/timeline/timeline.service';
import {UserInfoModel} from "../api/user-info/user-info.model";

@Component({
  selector: 'live-room-top-bar',
  templateUrl: './live-room-top-bar.component.html',
  styleUrls: ['./live-room-top-bar.component.scss'],
})

export class LiveRoomTopBarComponent implements OnInit, OnDestroy {
  @Input() liveId: string;
  @Input() userInfo: UserInfoModel;
  unreadCount = 0;
  fromInfoCenter: string;
  pageUserId: string;

  constructor(private router: Router, private timelineService: TimelineService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.fromInfoCenter = this.route.snapshot.params['fromInfoCenter'];
    this.pageUserId = this.route.snapshot.params['pageUserId'];
    if (this.liveId) {
      this.timelineService.startReceive(this.liveId);
      this.timelineService.onReceivedEvents(evt => this.receivedEvents(evt));
    }
  }

  ngOnDestroy() {
    if (this.liveId) {
      this.timelineService.stopReceive(this.liveId);
    }
  }

  receivedEvents(evt: MqEvent) {
    if (evt.event === EventType.LiveMsgUpdate) {
      this.unreadCount++;
    }
  }

  backToMainScreen() {
    if (this.fromInfoCenter) {
      this.router.navigate([`/info-center/${this.pageUserId}`]);
    } else if (this.liveId) {
      this.router.navigate([`/lives/${this.liveId}`]);
    } else {
      this.router.navigate([`/info-center/${this.userInfo.uid}`]);
    }
  }
}
