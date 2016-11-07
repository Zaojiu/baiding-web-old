import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

moment.locale('zh-cn');

@Pipe({name: 'timeFormater'})
export class TimeFormaterPipe implements PipeTransform {
  transform(time: string, format: string): string {
    var timeParsed = moment(+time / 1e6);
    if (!timeParsed.isValid()) timeParsed = moment(time);
    if (!timeParsed.isValid()) return '无效时间';
    return timeParsed.format(format);
  }
}

@Pipe({name: 'durationFormater'})
export class DurationFormaterPipe implements PipeTransform {
  transform(durationSecond: number, index: number): string {
    let fixDigest = (num: string) => {
      if (num.length === 1) return `0${num}`;
      return num;
    };

    if (durationSecond <= 0) return '00';

    let d = Math.floor(durationSecond / (24 * 60 * 60));
    let h = Math.floor(durationSecond % (24 * 60 * 60) / (60 * 60));
    let m = Math.floor(durationSecond % (24 * 60 * 60) % (60 * 60) / 60);
    let s = Math.floor(durationSecond % (24 * 60 * 60) % (60 * 60) % 60);

    if (index === 0) return fixDigest(d.toString());
    if (index === 1) return fixDigest(h.toString());
    if (index === 2) return fixDigest(m.toString());
    if (index === 3) return fixDigest(s.toString());

    return '无效时间';
  }
}

@Pipe({name: 'timeTo'})
export class TimeToPipe implements PipeTransform {
  transform(fromTime: string, endTime: string): number {
    var fromTimeParsed = moment.unix(+fromTime);
    if (!fromTimeParsed.isValid()) fromTimeParsed = moment(fromTime);
    if (!fromTimeParsed.isValid()) return 0;

    var endTimeParsed = moment.unix(+endTime);
    if (!endTimeParsed.isValid()) endTimeParsed = moment(endTime);
    if (!endTimeParsed.isValid()) return 0;

    let sec = Math.round(endTimeParsed.diff(fromTimeParsed) / 1000);

    return sec;
  }
}

@Pipe({name: 'fromNow'})
export class FromNowPipe implements PipeTransform {
  transform(time: string): string {
    return moment(+time / 1e6).fromNow();
  }
}
