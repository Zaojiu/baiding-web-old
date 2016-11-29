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

    if (index === 1) return fixDigest(d.toString());
    if (index === 2) return fixDigest(h.toString());
    if (index === 3) return fixDigest(m.toString());
    if (index === 4) return fixDigest(s.toString());

    // 如果想获取单独每位字符
    if (index === 10) return fixDigest(d.toString()).substr(0, 1);
    if (index === 11) return fixDigest(d.toString()).substr(1, 2);
    if (index === 20) return fixDigest(h.toString()).substr(0, 1);
    if (index === 21) return fixDigest(h.toString()).substr(1, 2);
    if (index === 30) return fixDigest(m.toString()).substr(0, 1);
    if (index === 31) return fixDigest(m.toString()).substr(1, 2);
    if (index === 40) return fixDigest(s.toString()).substr(0, 1);
    if (index === 41) return fixDigest(s.toString()).substr(1, 2);

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
