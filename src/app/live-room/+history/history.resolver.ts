import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {MessageModel} from "../../shared/api/message/message.model";
import {MessageApiService} from "../../shared/api/message/message.api";

@Injectable()
export class HistoryMessageResolver implements Resolve<MessageModel> {
  constructor(private messageApiService: MessageApiService) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<MessageModel[]> {
    let liveId = route.parent.params['id'];

    return this.messageApiService.history(liveId).then(messages => {
      return messages;
    });
  }
}
