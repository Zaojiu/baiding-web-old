import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LiveInfoModel} from '../../shared/live/live.model';
import {LiveService} from '../../shared/live/live.service';
import {LiveStatus} from "../../shared/live/live.enums";
import {UtilsService} from '../../shared/utils/utils'

@Component({
  selector: 'live-room-info',
  templateUrl: './live-room-info.component.html',
  styleUrls: ['./live-room-info.component.scss'],
})

export class LiveRoomInfoComponent {
  @Input() liveInfo: LiveInfoModel;
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();
  @Input() liveRoomStatusHumanize: string;
  isLiveRoomStarted: boolean;
  timeNow = UtilsService.now();

  constructor(private liveService: LiveService) {
  }

  ngOnInit() {
    if (this.liveInfo.status === LiveStatus.Started) {
      this.isLiveRoomStarted = false;
      this.liveRoomStatusHumanize = '直播中'
    } else {
      this.isLiveRoomStarted = true;
      this.liveRoomStatusHumanize = '未开始'
    }
  }

  close() {
    this.isShowChange.emit(false);
  }

  toBeginnerGuide() {
    this.close();
    this.liveService.setLiveRoomAlreadyVisited();
  }
}
