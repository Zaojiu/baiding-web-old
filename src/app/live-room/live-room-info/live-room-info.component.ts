import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveService} from '../../shared/api/live/live.service';
import {LiveStatus} from "../../shared/api/live/live.enums";
import {UtilsService} from '../../shared/utils/utils';

@Component({
  selector: 'live-room-info',
  templateUrl: './live-room-info.component.html',
  styleUrls: ['./live-room-info.component.scss'],
})

export class LiveRoomInfoComponent {
  @Input() liveInfo: LiveInfoModel;
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();
  timeNow = UtilsService.now.toString();

  constructor(private liveService: LiveService) {
  }


  close() {
    this.isShowChange.emit(false);
  }

  toBeginnerGuide() {
    this.close();
    this.liveService.setLiveRoomAlreadyVisited();
  }

  get liveRoomStatusHumanize(): string {
    switch (this.liveInfo.status) {
      case LiveStatus.Created:
        return '未开始';
      case LiveStatus.Started:
        return '直播中';
      case LiveStatus.Ended:
        return '已结束';
      default:
        return '未知状态';
    }
  }
}
