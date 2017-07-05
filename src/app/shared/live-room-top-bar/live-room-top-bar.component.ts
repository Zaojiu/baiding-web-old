import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';

import {MqEvent, EventType} from "../../shared/mq/mq.service";
import {TimelineService} from '../../+live-room/timeline/timeline.service';
import {UserInfoService} from "../api/user-info/user-info.service";

@Component({
  selector: 'live-room-top-bar',
  templateUrl: './live-room-top-bar.component.html',
  styleUrls: ['./live-room-top-bar.component.scss'],
})

export class LiveRoomTopBarComponent implements OnInit, OnDestroy {
  @Input() liveId: string;
  unreadCount = 0;
  from: string;
  eventSub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute,
              private timelineService: TimelineService, private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.from = this.route.snapshot.params['from'] ? this.route.snapshot.params['from'] : '';

    if (this.liveId) {
      this.eventSub = this.timelineService.event$.subscribe(evt => this.receivedEvents(evt));
    }
  }

  ngOnDestroy() {
    if (this.eventSub) this.eventSub.unsubscribe();
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
      const userInfo = this.userInfoService.getUserInfoCache();
      if (userInfo) this.router.navigate([`/info-center/${userInfo.uid}`]);
    }
  }
}
