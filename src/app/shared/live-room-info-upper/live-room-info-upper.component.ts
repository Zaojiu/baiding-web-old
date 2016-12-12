import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {UtilsService} from '../../shared/utils/utils';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'live-room-info-upper',
  templateUrl: './live-room-info-upper.component.html',
  styleUrls: ['./live-room-info-upper.component.scss'],
})

export class LiveRoomInfoUpperComponent implements OnInit,OnDestroy {
  liveId: string;
  @Input() liveInfo: LiveInfoModel;
  timeNow = UtilsService.now.toString();
  timer: any;
  coverUrl: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.timer = setInterval(()=> {
      this.timeNow = UtilsService.now.toString();
    }, 1000);

    let coverUrl = this.liveInfo.coverSmallUrl ? this.liveInfo.coverSmallUrl : '/assets/img/default-cover.jpg';
    this.coverUrl = this.sanitizer.bypassSecurityTrustUrl(coverUrl);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

}
