import {Pipe, PipeTransform} from '@angular/core';

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

    // 适用格式 天：小时：分：秒
    let d = Math.floor(durationSecond / (24 * 60 * 60));
    let h = Math.floor(durationSecond % (24 * 60 * 60) / (60 * 60));
    let m = Math.floor(durationSecond % (24 * 60 * 60) % (60 * 60) / 60);
    let s = Math.floor(durationSecond % (24 * 60 * 60) % (60 * 60) % 60);

    if (index === 1) return d ? fixDigest(d.toString()) : '';
    if (index === 2) return fixDigest(h.toString());
    if (index === 3) return fixDigest(m.toString());
    if (index === 4) return fixDigest(s.toString());

    // 适用格式 小时：分：秒
    let _h = Math.floor(durationSecond / (60 * 60));
    let _m = Math.floor(durationSecond % (60 * 60) / 60);
    let _s = Math.floor(durationSecond % (60 * 60) % 60);

    if (index === 5) return fixDigest(_h.toString());
    if (index === 6) return fixDigest(_m.toString());
    if (index === 7) return fixDigest(_s.toString());

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

// 直播进行时长
@Pipe({name: 'timeToFormated'})
export class TimeToFormatedPipe implements PipeTransform {
  transform(fromTime: string, endTime: string): string {
    var fromTimeParsed = moment.unix(+fromTime);
    if (!fromTimeParsed.isValid()) fromTimeParsed = moment(fromTime);
    if (!fromTimeParsed.isValid()) return '无效时间';

    var endTimeParsed = moment.unix(+endTime);
    if (!endTimeParsed.isValid()) endTimeParsed = moment(endTime);
    if (!endTimeParsed.isValid()) return '无效时间';

    let sec = Math.round(endTimeParsed.diff(fromTimeParsed) / 1000);
    let momentSec = moment.duration(sec, 'seconds');

    // hhmmss
    if (momentSec.days() === 0 && momentSec.hours() !== 0) {
      let hhmmss = momentSec.hours().toString() + '小时' + momentSec.minutes().toString() + '分钟';
      return hhmmss;
    }
    // mmss
    if (momentSec.days() === 0 && momentSec.hours() === 0 && momentSec.minutes() !== 0) {
      let mmss = momentSec.minutes().toString() + '分钟';
      return mmss;
    }
    // ss
    if (momentSec.days() === 0 && momentSec.hours() === 0 && momentSec.minutes() === 0 && momentSec.seconds() !== 0) {
      let ss = momentSec.seconds().toString() + '秒';
      return ss;
    }

    let ddhhmmss = momentSec.days().toString() + '天' + momentSec.hours().toString() + '小时';
    return ddhhmmss;
  }
}
