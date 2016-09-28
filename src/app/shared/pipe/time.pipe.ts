import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
moment.locale('zh-cn');

let countdown = require("moment-countdown/vendor/countdown/countdown.js");

@Pipe({name: 'timeFormater'})
export class TimeFormaterPipe implements PipeTransform {
  transform(time: string, format: string): string {
    var timeParsed = moment(+time / 1e6)
    if (!timeParsed.isValid()) timeParsed = moment(time)
    if (!timeParsed.isValid()) return '无效时间'
    return timeParsed.format(format);
  }
}

@Pipe({name: 'durationFormater'})
export class DurationFormaterPipe implements PipeTransform {
  transform(time: string, index: number): string {
    var timeParsed = moment(+time / 1e6)
    if (!timeParsed.isValid()) timeParsed = moment(time)
    if (!timeParsed.isValid()) return '无效时间'
    let durationString = timeParsed.countdown(moment(), countdown.DAYS|countdown.HOURS|countdown.MINUTES, NaN, 0).toString();
    let durationRegexp = /^(\d+)\D*?(\d+)\D*?(\d+)\D*?$/
    let matchArr = durationRegexp.exec(durationString)
    if (matchArr.length != 4) return '无效时间'
    if (index === 0) return matchArr[1]
    if (index === 1) return matchArr[2]
    if (index === 2) return matchArr[3]
    return  '无效时间'
  }
}

@Pipe({name: 'fromNow'})
export class FromNowPipe implements PipeTransform {
  transform(time: string): string {
    return moment(+time / 1e6).fromNow();
  }
}
