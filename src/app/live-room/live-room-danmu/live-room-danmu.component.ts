import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { LiveRoomDanmuModel } from './live-room-danmu.model';
import { LiveRoomCommentService } from './live-room-danmu.service';

@Component({
  selector: 'live-room-danmu',
  templateUrl: './live-room-danmu.component.html',
  styleUrls: ['./live-room-danmu.component.scss']
})

export class LiveRoomDanmuComponent implements OnInit, OnDestroy {
  @Input() streamId: string;

  maxDanmuAmount: number = 3;
  danmus: LiveRoomDanmuModel[] = [];

  constructor(private liveRoomCommentService: LiveRoomCommentService) { }

  ngOnInit() {
    this.liveRoomCommentService.startReceive(this.streamId);
    this.liveRoomCommentService.onReceiveComments(comment => {
        this.onReceiveComments(comment)
    });
  }

  ngOnDestroy() {
    this.liveRoomCommentService.stopReceive(this.streamId)
  }

  onReceiveComments(comment: LiveRoomDanmuModel) {
    if (this.danmus.length >= this.maxDanmuAmount) {
      this.danmus.shift();
    }

    this.danmus.push(comment);
  }
}
