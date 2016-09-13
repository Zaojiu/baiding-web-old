import { Injectable }     from '@angular/core';
import { Subject }        from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import { MessageModel, ReplyMessageModel } from './message/message.model';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { MqService, MqEvent } from '../../shared/mq/mq.service';

@Injectable()
export class TimelineService {
  // Observable string sources
  private receivedMessageSource = new Subject<MessageModel>();
  private receivedReplySource = new Subject<ReplyMessageModel>();
  private scrollerSource = new Subject<boolean>();
  private scrollToSource = new Subject<boolean>();
  private timelineSource = new Subject<boolean>();
  private praisesSource = new Subject<UserInfoModel>();
  private eventSource = new Subject<MqEvent>();
  // Observable string streams
  receivedReply$ = this.receivedReplySource.asObservable();
  scroller$ = this.scrollerSource.asObservable();
  scrollTo$ = this.scrollToSource.asObservable();
  timeline$ = this.timelineSource.asObservable();
  private receivedPraises$ = this.praisesSource.asObservable();
  private event$ = this.eventSource.asObservable()

  private receviedPraisedUserSubscription: Subscription;
  private receivedEventSub: Subscription

  constructor() { }

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

  gotoFirstMessage() {
    this.timelineSource.next(true);
  }

  gotoLastMessage() {
    this.timelineSource.next(false);
  }

  pushMessage(message: MessageModel) {
    this.receivedMessageSource.next(message);
  }

  pushReply(reply: ReplyMessageModel) {
    this.receivedReplySource.next(reply);
  }

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
  }

  onReceivedEvents(f: any) {
    this.receivedEventSub = this.event$.subscribe(f)
  }

  onReceivedPraises(f: any) {
    this.receviedPraisedUserSubscription = this.receivedPraises$.subscribe(f)
  }
}
