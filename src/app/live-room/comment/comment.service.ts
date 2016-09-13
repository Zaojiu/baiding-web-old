import { Injectable }     from '@angular/core';
import { Subject }        from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import { CommentModel }      from './comment.model';
import { MqService } from '../../shared/mq/mq.service';

@Injectable()
export class CommentService {
  // Observable string sources
  private receivedCommentSource = new Subject<CommentModel>();
  // Observable string streams
  private receivedComment$ = this.receivedCommentSource.asObservable();

  private receivedCommentSub: Subscription;

  constructor() {}

  pushComment(comment: CommentModel) {
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
