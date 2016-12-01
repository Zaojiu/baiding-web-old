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
  daysArr: any;
  hrs_1: string;
  hrs_2: string;
  mins_1: string;
  mins_2: string;
  secs_1: string;
  secs_2: string;
  display = true;

  ngOnInit() {
    let endTime = this.liveInfo.expectStartAt;
    let timeNow: number = UtilsService.now;
    this.timer = setInterval(() => {
      timeNow++;
      let endTimeParsed = moment.unix(+moment(endTime) / 1000);
      let durationSec = Math.round(endTimeParsed.diff(moment.unix(timeNow)) / 1000);

      if (durationSec < 0) {
        this.display = false;
        return;
      }

      let days = Math.floor(durationSec / (24 * 60 * 60)).toString();
      let hrs = Math.floor(durationSec % (24 * 60 * 60) / (60 * 60)).toString();
      let mins = Math.floor(durationSec % (24 * 60 * 60) % (60 * 60) / 60).toString();
      let secs = Math.floor(durationSec % (24 * 60 * 60) % (60 * 60) % 60).toString();


      this.daysArr = days.split('');
      if (this.daysArr.length === 1) this.daysArr.unshift(0);
      if (+hrs < 10) hrs = '0' + hrs;
      if (+mins < 10) mins = '0' + mins;
      if (+secs < 10) secs = '0 ' + secs;

      this.hrs_1 = hrs.substr(0, 1);
      this.hrs_2 = hrs.substr(1, 2);
      this.mins_1 = mins.substr(0, 1);
      this.mins_2 = mins.substr(1, 2)
      this.secs_1 = secs.substr(0, 1);
      this.secs_2 = secs.substr(1, 2);

    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
