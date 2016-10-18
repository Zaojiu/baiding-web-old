import { Pipe, PipeTransform } from '@angular/core';
import { UserInfoModel } from '../api/user-info/user-info.model';
import { LiveInfoModel } from '../api/live/live.model';

@Pipe({name: 'role'})
export class RolePipe implements PipeTransform {
  transform(userInfo: UserInfoModel, liveInfo: LiveInfoModel): string {
    if (userInfo.uid === liveInfo.admin.uid) return '主持人';

    for ( let editor of liveInfo.editors ) {
      if (userInfo.uid === editor.uid) return '嘉宾';
    }

    return '观众';
  }
}
