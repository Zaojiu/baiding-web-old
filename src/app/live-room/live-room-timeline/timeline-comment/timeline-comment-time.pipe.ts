import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
moment.locale('zh-cn');

@Pipe({name: 'time'})
export class TimelineCommentTimePipe implements PipeTransform {
  transform(time: string): string {
    return moment(+time / 1e6).fromNow();
  }
}
