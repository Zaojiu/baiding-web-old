import { Injectable, Input }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject }        from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import { LiveRoomDanmuModel }      from './live-room-danmu.model';
import { UserInfoModel }  from '../../shared/user-info/user-info.model';
import { MqService } from '../../shared/mq/mq.service';

@Injectable()
export class LiveRoomCommentService {
  // Observable string sources
  private receivedCommentSource = new Subject<LiveRoomDanmuModel>();
  // Observable string streams
  private receivedComment$ = this.receivedCommentSource.asObservable();

  private receivedCommentSub: Subscription;

  constructor(private http: Http) { }

  pushComment(comment: LiveRoomDanmuModel) {
    this.receivedCommentSource.next(comment)
  }

  startReceive(streamId: string) {
    MqService.subscribeLiveComments(streamId, this.receivedCommentSource)
  }

  stopReceive(streamId: string) {
    MqService.unsubscribeLiveComments(streamId)

    if (this.receivedCommentSub) {
      this.receivedCommentSub.unsubscribe();
    }
  }

  onReceiveComments(f: any) {
    this.receivedCommentSub = this.receivedComment$.subscribe(f)
  }
}
