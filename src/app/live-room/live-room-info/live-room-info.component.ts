import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LiveInfoModel} from '../../shared/live/live.model';
import {LiveService} from '../../shared/live/live.service';

@Component({
  selector: 'live-room-info',
  templateUrl: './live-room-info.component.html',
  styleUrls: ['./live-room-info.component.scss'],
})

export class LiveRoomInfoComponent {
  @Input() liveInfo: LiveInfoModel;
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();
  @Input() liveRoomStatusWord: string;
  liveRoomStartStatus: boolean;

  constructor(private liveService: LiveService) {
  }

  ngOnInit() {
    if (this.liveInfo.status == 3) {
      this.liveRoomStartStatus = false;
      this.liveRoomStatusWord = '直播中'
    } else {
      this.liveRoomStartStatus = true;
      this.liveRoomStatusWord = '未开始'
    }
  }

  close() {
    this.isShowChange.emit(false);
  }

  toBeginnerGuide() {
    this.close();
    this.liveService.LiveRoomAlreadyVisited();
  }
}
