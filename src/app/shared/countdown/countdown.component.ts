import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveStatus} from '../../shared/api/live/live.enums';
import {UtilsService} from '../../shared/utils/utils';

@Component({
  selector: 'count-down',
  templateUrl: 'countdown.component.html',
  styleUrls: ['countdown.component.scss'],
})

export class CountDownComponent implements OnInit,OnDestroy {
  liveId: string;
  @Input() liveInfo: LiveInfoModel;
  timeNow = UtilsService.now.toString();
  timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.timeNow = UtilsService.now.toString();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get liveRoomStatusHumanize(): string {
    switch (this.liveInfo.status) {
      case LiveStatus.Created:
        return '倒计时';
      case LiveStatus.Started:
        return '直播中';
      case LiveStatus.Ended:
        return '已结束';
      default:
        return '未知状态';
    }
  }
}
