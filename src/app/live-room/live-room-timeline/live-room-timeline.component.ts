import { Component, OnInit } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { TimelineCommentModel } from './timeline-comment/timeline-comment.model';
import { LiveRoomTimelineService } from './live-room-timeline.service';
import { UserInfoService } from '../../shared/user-info/user-info.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';

@Component({
  selector: 'live-room-timeline',
  templateUrl: './live-room-timeline.component.html',
  styleUrls: ['./live-room-timeline.component.scss'],
  providers: [ LiveRoomTimelineService, UserInfoService ]
})

export class LiveRoomTimelineComponent implements OnInit {
  comments: TimelineCommentModel[] = [];
  userInfo: UserInfoModel;
  timelineServiceSubscription: Subscription;

  constructor(private timelineService: LiveRoomTimelineService, private userInfoService: UserInfoService) {}

  ngOnInit() {
    this.userInfoService.getUserInfo().then(userInfo => {
      this.userInfo = userInfo;
      this.startReceiveComment();
    });
  }

  startReceiveComment() {
    this.timelineService.onReceive();
    this.timelineServiceSubscription = this.timelineService.receivedComment$.subscribe(
      comment => {
        this.comments.push(comment);
      }
    );
  }
}
