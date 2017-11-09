import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {LiveInfoModel} from '../api/live/live.model';
import {UtilsService} from '../utils/utils';

@Component({
  selector: 'live-cover',
  templateUrl: './live-cover.component.html',
  styleUrls: ['./live-cover.component.scss'],
})

export class LiveCoverComponent implements OnInit,OnDestroy {
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

    this.coverUrl = this.sanitizer.bypassSecurityTrustUrl(this.liveInfo.coverSmallUrl);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
