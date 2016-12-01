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
  @Input() expectStartAt: string;
  @Input() countDownStatus: boolean;
  timer: any;
  daysArr: any;
  hrs1: string;
  hrs2: string;
  mins1: string;
  mins2: string;
  secs1: string;
  secs2: string;
  display = true;

  ngOnInit() {
    let endTime = this.expectStartAt;
    let timeNow: number = UtilsService.now;

    this.timer = setInterval(() => {
      timeNow++;
      let endTimeParsed = moment.unix(+moment(endTime) / 1000);
      let durationSec = Math.round(endTimeParsed.diff(moment.unix(timeNow)) / 1000);

      if (durationSec < 0) {
        this.display = false;
        return;
      }

      let oneDaySecs = 24 * 60 * 60;
      let days = Math.floor(durationSec / (oneDaySecs)).toString();
      let hrs = Math.floor(durationSec % (oneDaySecs) / (60 * 60)).toString();
      let mins = Math.floor(durationSec % (oneDaySecs) % (60 * 60) / 60).toString();
      let secs = Math.floor(durationSec % (oneDaySecs) % (60 * 60) % 60).toString();

      this.daysArr = days.split('');
      if (this.daysArr.length === 1) this.daysArr.unshift(0);

      if (+hrs < 10) hrs = '0' + hrs;
      if (+mins < 10) mins = '0' + mins;
      if (+secs < 10) secs = '0 ' + secs;

      this.hrs1 = hrs.substr(0, 1);
      this.hrs2 = hrs.substr(1, 2);
      this.mins1 = mins.substr(0, 1);
      this.mins2 = mins.substr(1, 2)
      this.secs1 = secs.substr(0, 1);
      this.secs2 = secs.substr(1, 2);

    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
