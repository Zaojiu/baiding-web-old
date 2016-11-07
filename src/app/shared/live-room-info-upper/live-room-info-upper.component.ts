import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveStatus} from '../../shared/api/live/live.enums';
import {UtilsService} from '../../shared/utils/utils';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'live-room-info-upper',
  templateUrl: 'live-room-info-upper.component.html',
  styleUrls: ['live-room-info-upper.component.scss'],
})

export class LiveRoomInfoUpperComponent implements OnInit,OnDestroy {
  liveId: string;
  @Input() liveInfo: LiveInfoModel;
  timeNow = UtilsService.now.toString();
  timer: any;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.timer = setInterval(()=> {
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
        return '直播结束';
      default:
        return '未知状态';
    }
  }

  get coverUrl(): SafeUrl {
    let coverUrl = this.liveInfo.coverUrl ? this.liveInfo.coverUrl : '/assets/img/liveroombanner-blur.jpg';
    return this.sanitizer.bypassSecurityTrustUrl(coverUrl);
  }
}
