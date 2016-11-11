import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {MqEvent, EventType} from "../../shared/mq/mq.service";
import {TimelineService} from '../../live-room/timeline/timeline.service';

@Component({
  selector: 'live-room-top-bar',
  templateUrl: './live-room-top-bar.component.html',
  styleUrls: ['./live-room-top-bar.component.scss'],
})

export class LiveRoomTopBarComponent implements OnInit, OnDestroy {
  @Input() liveId: string;
  unreadCount = 0;

  constructor(private router: Router, private timelineService: TimelineService) {
  }

  ngOnInit() {
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
    this.router.navigate(['/lives/' + this.liveId]);
  }
}
