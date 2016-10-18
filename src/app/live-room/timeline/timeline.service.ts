import {Injectable}     from '@angular/core';
import {Subject}        from 'rxjs/Subject';
import {Subscription}   from 'rxjs/Subscription';

import {MessageModel, ReplyMessageModel} from '../../shared/api/message/message.model';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {MqService, MqEvent} from '../../shared/mq/mq.service';
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";

@Injectable()
export class TimelineService {
  // Observable string sources
  private receivedMessageSource = new Subject<MessageModel>();
  private receivedReplySource = new Subject<ReplyMessageModel>();
  private timelineSource = new Subject<boolean>();
  private praisesSource = new Subject<UserInfoModel>();
  private eventSource = new Subject<MqEvent>();
  private scrollSource = new Subject<ScrollerEventModel>();

  // Observable string streams
  private receivedMessage$ = this.receivedMessageSource.asObservable();
  receivedReply$ = this.receivedReplySource.asObservable();
  timeline$ = this.timelineSource.asObservable();
  private receivedPraises$ = this.praisesSource.asObservable();
  event$ = this.eventSource.asObservable();
  scroll$ = this.scrollSource.asObservable();

  private receviedMessageSub: Subscription;
  private receviedPraisedUserSubscription: Subscription;
  private receivedEventSub: Subscription;

  constructor() {
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

  onScroll(e: ScrollerEventModel) {
    this.scrollSource.next(e);
  }
}
