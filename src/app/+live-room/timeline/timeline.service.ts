import {Injectable}     from '@angular/core';
import {Subject}        from 'rxjs/Subject';
import {Subscription}   from 'rxjs/Subscription';
import {Observable} from "rxjs/Observable";

import {MessageModel, ReplyMessageModel} from '../../shared/api/message/message.model';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {MqService, MqEvent, MqPraisedUser} from '../../shared/mq/mq.service';
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";

@Injectable()
export class TimelineService {
  private receivedReplySource = new Subject<ReplyMessageModel>();
  receivedReply$: Observable<ReplyMessageModel> = this.receivedReplySource.asObservable();

  private scrollSource = new Subject<ScrollerEventModel>();
  scroll$: Observable<ScrollerEventModel> = this.scrollSource.asObservable();

  private eventSource = new Subject<MqEvent>();
  private receivedEventSub: Subscription;
  event$: Observable<MqEvent> = this.eventSource.asObservable();

  private timelineSource = new Subject<boolean>();
  private timeline$: Observable<boolean> = this.timelineSource.asObservable();
  private timelineSub: Subscription;

  private receivedPraisesSource = new Subject<MqPraisedUser>();
  private receivedPraises$: Observable<MqPraisedUser> = this.receivedPraisesSource.asObservable();
  private receviedPraisesSub: Subscription;

  private receivedMessageSource = new Subject<MessageModel>();
  private receivedMessage$: Observable<MessageModel> = this.receivedMessageSource.asObservable();
  private receviedMessageSub: Subscription;

  private deleteMessageSource = new Subject<MessageModel>();
  private deleteMessage$: Observable<MessageModel> = this.deleteMessageSource.asObservable();
  private deleteMessageSub: Subscription;

  private avatarTouchedSource = new Subject <UserInfoModel>();
  avatarTouched$: Observable<UserInfoModel> = this.avatarTouchedSource.asObservable();

  avatarTouched(userInfo: UserInfoModel) {
    this.avatarTouchedSource.next(userInfo);
  }

  constructor() {}

  gotoFirstMessage() {
    this.timelineSource.next(true);
  }

  gotoLastMessage() {
    this.timelineSource.next(false);
  }

  pushMessage(message: MessageModel) {
    this.receivedMessageSource.next(message);
  }

  deleteMessage(message: MessageModel) {
    this.deleteMessageSource.next(message);
  }

  triggerScroll(e: ScrollerEventModel) {
    this.scrollSource.next(e);
  }

  // TODO: duplicate in new replies logic
  pushReply(reply: ReplyMessageModel) {
    this.receivedReplySource.next(reply);
  }

  startReceive(id: string) {
    MqService.subscribeLiveEvents(id, this.eventSource);
    MqService.subscribeLivePraises(id, this.receivedPraisesSource);
  }

  stopReceive(id: string) {
    MqService.unsubscribeLiveEvents(id);
    MqService.unsubscribeLivePraises(id);

    if (this.receivedEventSub) this.receivedEventSub.unsubscribe();
    if (this.receviedPraisesSub) this.receviedPraisesSub.unsubscribe();
    if (this.receviedMessageSub) this.receviedMessageSub.unsubscribe();
  }

  onReceivedEvents(f: any) {
    this.receivedEventSub = this.event$.subscribe(f)
  }

  onReceivedPraises(cb: (praisedUser: MqPraisedUser) => void) {
    this.receviedPraisesSub = this.receivedPraises$.subscribe(cb);
  }

  // 自己发送的
  onReceiveMessages(f: any) {
    this.receviedMessageSub = this.receivedMessage$.subscribe(f)
  }

  // 删除时间线上的消息
  onDeleteMessages(f: any) {
    this.deleteMessageSub = this.deleteMessage$.subscribe(f)
  }

  onTimeLiveAction(cb: (gotoOldestOrLatest: boolean) => void) {
    this.timelineSub = this.timeline$.subscribe(cb);
  }

  unsubscribeAll() {
    if (this.deleteMessageSub) this.deleteMessageSub.unsubscribe();
    if (this.receviedMessageSub) this.receviedMessageSub.unsubscribe();
    if (this.receviedPraisesSub) this.receviedPraisesSub.unsubscribe();
    if (this.receivedEventSub) this.receivedEventSub.unsubscribe();
    if (this.timelineSub) this.timelineSub.unsubscribe();
  }
}
