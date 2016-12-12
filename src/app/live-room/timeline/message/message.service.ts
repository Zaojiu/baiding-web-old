import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Subject} from "rxjs";
import {Observable} from "rxjs/Observable";

import {UserInfoModel} from "../../../shared/api/user-info/user-info.model";
import {MessageApiService} from "../../../shared/api/message/message.api";

@Injectable()
export class MessageService {
  constructor(private messageApiService: MessageApiService) {
  }

  private avatarTouchedSource = new Subject <UserInfoModel>();
  avatarTouched$: Observable<UserInfoModel> = this.avatarTouchedSource.asObservable();

  confirmPraise(liveId: string, msgId: string, praised: boolean, num: number): Promise<void> {
    return this.messageApiService.praise(liveId, msgId, praised, num);
  }

  emitAvatarUser(messageUser: UserInfoModel) {
    this.avatarTouchedSource.next(messageUser);
  }
}
