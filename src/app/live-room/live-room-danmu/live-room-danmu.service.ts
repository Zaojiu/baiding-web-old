import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { LiveRoomDanmuModel }      from './live-room-danmu.model';
import { DanmuCallBackFunc } from './live-room-danmu.interface'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LiveRoomDanmuService {
  constructor (private http: Http) {}
  onReceive (callback: DanmuCallBackFunc) {
    setInterval(function(){
      var newDanmu = new LiveRoomDanmuModel()
      newDanmu.content = '白丁弹幕首测' + Date.now()
      newDanmu.avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'

      callback(newDanmu);
    }, 500)
  }
}
