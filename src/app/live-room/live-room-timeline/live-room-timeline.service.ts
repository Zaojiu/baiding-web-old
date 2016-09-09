import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject }        from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import { TimelineCommentModel, TimelineCommentReplyModel } from './timeline-comment/timeline-comment.model';
import { TimelineCommentType } from './timeline-comment/timeline-comment.enum';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { MqService, MqEvent } from '../../shared/mq/mq.service';



@Injectable()
export class LiveRoomTimelineService {
  // Observable string sources
  private receivedMessageSource = new Subject<TimelineCommentModel>();
  private receivedReplySource = new Subject<TimelineCommentReplyModel>();
  private scrollerSource = new Subject<boolean>();
  private scrollToSource = new Subject<boolean>();
  private timelineSource = new Subject<boolean>();
  private praisesSource = new Subject<UserInfoModel>();
  private eventSource = new Subject<MqEvent>();
  // Observable string streams
  private receivedMessage$ = this.receivedMessageSource.asObservable();
  receivedReply$ = this.receivedReplySource.asObservable();
  scroller$ = this.scrollerSource.asObservable();
  scrollTo$ = this.scrollToSource.asObservable();
  timeline$ = this.timelineSource.asObservable();
  private receivedPraises$ = this.praisesSource.asObservable();
  private event$ = this.eventSource.asObservable()

  private receviedMessageSub: Subscription;
  private receviedPraisedUserSubscription: Subscription;
  private receivedEventSub: Subscription

  constructor(private http: Http) { }

  notifyScrollerOnTop() {
    this.scrollerSource.next(true);
  }

  notifyScrollerOnBottom() {
    this.scrollerSource.next(false);
  }

  scrollToTop() {
    this.scrollToSource.next(true);
  }

  scrollToBottom() {
    this.scrollToSource.next(false);
  }

  gotoFirstComment() {
    this.timelineSource.next(true);
  }

  gotoLastComment() {
    this.timelineSource.next(false);
  }

  pushComment(comment: TimelineCommentModel) {
    this.receivedMessageSource.next(comment);
  }

  pushReply(reply: TimelineCommentReplyModel) {
    this.receivedReplySource.next(reply);
  }

  // pushPraisedUser(praisedUser: PraisedUserModel) {
  //   this.receivedCommentSource.next(praisedUser);
  // }



  // startReceiveComment() {
  //   this.receviedCommentSubscription = this.timelineService.receivedMessage$.subscribe(
  //     comment => {
  //       this.comments.push(comment);
  //     }
  //   );
  // }

  startReceive(id: string) {
    MqService.subscribeLiveEvents(id, this.eventSource)
    MqService.subscribeLivePraises(id, this.praisesSource)
  }

  stopReceive(id: string) {
    MqService.unsubscribeLiveEvents(id)
    MqService.unsubscribeLivePraises(id)

    if (this.receivedEventSub) {
      this.receivedEventSub.unsubscribe()
    }

    if (this.receviedPraisedUserSubscription) {
      this.receviedPraisedUserSubscription.unsubscribe()
    }

    if (this.receviedMessageSub) {
      this.receviedMessageSub.unsubscribe()
    }
  }

  onReceivedEvents(f: any) {
    this.receivedEventSub = this.event$.subscribe(f)
  }

  onReceivedPraises(f: any) {
    this.receviedPraisedUserSubscription = this.receivedPraises$.subscribe(f)
  }

  // 自己发送的
  onReceiveMessages(f: any) {
    this.receviedMessageSub = this.receivedMessage$.subscribe(f)
  }
}
