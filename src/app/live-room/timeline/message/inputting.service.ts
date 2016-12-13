import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {Subject} from "rxjs";
import {MessageApiService} from "../../../shared/api/message/message.api";
import {InputtingMessageModel} from "../../../shared/api/message/message.model";


interface Inputter {
  liveId: string;
  type: string;
}

@Injectable()
export class InputtingService {

  private activeSub = new Subject <InputtingMessageModel >();
  actived$ = this.activeSub.asObservable();

  private collectSub = new Subject<Inputter>();

  constructor(private messageApiService: MessageApiService) {

    this.collectSub
      .asObservable()
      .throttleTime(5000)
      .subscribe((i) => {
        this.messageApiService.postInputtingMessage(i.liveId, i.type);
      });
  }

  collect(i: Inputter) {
    this.collectSub.next(i);
  }

  push(m: InputtingMessageModel) {
    this.activeSub.next(m);
  }
}
