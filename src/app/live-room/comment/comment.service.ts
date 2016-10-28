import { Injectable }     from '@angular/core';
import { Subject }        from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import { CommentModel }      from '../../shared/api/comment/comment.model';
import { MqService } from '../../shared/mq/mq.service';

@Injectable()
export class CommentService {
  private receivedCommentSource = new Subject<CommentModel>();
  private receivedComment$ = this.receivedCommentSource.asObservable();
  private receivedCommentSub: Subscription;
  private actionSource = new Subject<boolean>();
  action$ = this.actionSource.asObservable();

  constructor() {}

  gotoFirstComments() {
    this.actionSource.next(true);
  }

  gotoLastComments() {
    this.actionSource.next(false);
  }

  pushComment(comment: CommentModel) {
    this.receivedCommentSource.next(comment)
  }

  startReceive(streamId: string) {
    MqService.subscribeLiveComments(streamId, this.receivedCommentSource)
  }

  stopReceive(streamId: string) {
    MqService.unsubscribeLiveComments(streamId);

    if (this.receivedCommentSub) {
      this.receivedCommentSub.unsubscribe();
    }
  }

  onReceiveComments(f: any) {
    this.receivedCommentSub = this.receivedComment$.subscribe(f)
  }
}
