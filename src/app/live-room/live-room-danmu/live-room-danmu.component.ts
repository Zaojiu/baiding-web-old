import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { LiveRoomDanmuModel } from './live-room-danmu.model';
import { LiveRoomDanmuService } from './live-room-danmu.service';

@Component({
  providers: [ LiveRoomDanmuService ],
  selector: 'live-room-danmu',
  templateUrl: './live-room-danmu.component.html',
  styleUrls: ['./live-room-danmu.component.scss']
})

export class LiveRoomDanmuComponent implements OnInit, OnDestroy {
  maxDanmuAmount: number = 3;
  danmus: LiveRoomDanmuModel[] = [];
  danmuSubscription: Subscription;

  constructor(private liveRoomDanmuService: LiveRoomDanmuService) {}

  startReceiveComment() {
    this.liveRoomDanmuService.onReceive();
    this.danmuSubscription = this.liveRoomDanmuService.receivedDanmu$.subscribe(
      danmu => {
        if (this.danmus.length >= this.maxDanmuAmount) {
          this.danmus.shift();
        }

        this.danmus.push(danmu);
      }
    );
  }

  ngOnInit() {
    this.startReceiveComment();
  }

  ngOnDestroy() {
    this.danmuSubscription.unsubscribe();
  }
}
