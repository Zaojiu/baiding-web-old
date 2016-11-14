import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {PostPraiseModel} from '../../../shared/api/message/message.model'
import {UserInfoService} from "../../../shared/api/user-info/user-info.service";
import {Subject} from "rxjs";
import {UserInfoModel} from "../../../shared/api/user-info/user-info.model";
import {environment} from "../../../../environments/environment";


@Injectable()
export class MessageService {
  constructor(private http: Http, private userInfoService: UserInfoService) {
  }

  private avatarTouchedSource = new Subject < UserInfoModel >();
  avatarTouched$ = this.avatarTouchedSource.asObservable();

  confirmPraise(liveId: string, msgId: string, praised: boolean, num: number): Promise<void> {
    let data = new PostPraiseModel()
    data.praised = praised
    data.num = num

    let url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/${msgId}/praises`;
    return this.http.post(url, JSON.stringify(data)).toPromise()
      .then(res => {
        return
      }).catch(res => {
      });
  }

  cancelPraise(liveId: string, msgId: string): Promise<void> {
    let url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/${msgId}/praises`;

    return this.http.delete(url, null).toPromise()
      .then(res => {
        return
      }).catch(res => {
      });
  }

  emitAvatarUser(messageUser: UserInfoModel) {
    this.avatarTouchedSource.next(messageUser);
  }
}
