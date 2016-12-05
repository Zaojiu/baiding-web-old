import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

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
  from: string;

  constructor(private router: Router, private timelineService: TimelineService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.from = this.route.snapshot.params['from'] ? decodeURIComponent(this.route.snapshot.params['from']) : '';

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
    if (this.from) {
      this.router.navigateByUrl(this.from);
    } else if (this.liveId) {
      this.router.navigate([`/lives/${this.liveId}`]);
    } else {
      this.router.navigate([`/info-center`]);
    }
  }
}
