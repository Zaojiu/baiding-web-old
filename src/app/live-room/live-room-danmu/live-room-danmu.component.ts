import { Component, OnInit } from '@angular/core';
import { LiveRoomDanmuModel } from './live-room-danmu.model';
import { LiveRoomDanmuService } from './live-room-danmu.service';

@Component({
  providers: [ LiveRoomDanmuService ],
  selector: 'live-room-danmu',
  templateUrl: './live-room-danmu.component.html',
  styleUrls: ['./live-room-danmu.component.scss']
})

export class LiveRoomDanmuComponent implements OnInit {
  maxDanmuAmount: number = 3;
  danmus: LiveRoomDanmuModel[] = [];

  constructor(private liveRoomDanmuService: LiveRoomDanmuService) {}

  onReceive() {
    this.liveRoomDanmuService.onReceive((danmu: LiveRoomDanmuModel) => this.appendDanmu(danmu))
  }

  appendDanmu(danmu: LiveRoomDanmuModel) {
    console.log(this.danmus, danmu)

    if (this.danmus.length >= this.maxDanmuAmount) {
      this.danmus.shift()
    }

    this.danmus.push(danmu)
  }

  ngOnInit() {
    this.onReceive()
  }
}
