import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject }        from 'rxjs/Subject';

import { LiveRoomDanmuModel }      from './live-room-danmu.model';
import { UserInfoModel }  from '../../shared/user-info/user-info.model';

@Injectable()
export class LiveRoomDanmuService {
  // Observable string sources
  private receivedDanmuSource = new Subject<LiveRoomDanmuModel>();
  // Observable string streams
  receivedDanmu$ = this.receivedDanmuSource.asObservable();

  constructor (private http: Http) {}

  pushDanmu(danmu: LiveRoomDanmuModel) {
    this.receivedDanmuSource.next(danmu);
  }

  onReceive () {
    // setInterval(() => {
    //   var danmu = new LiveRoomDanmuModel();
    //   danmu.content = '白丁弹幕首测' + Date.now();
    //   danmu.user = new UserInfoModel();
    //   danmu.user.avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
    //   this.pushDanmu(danmu);
    // }, 500);
  }
}
