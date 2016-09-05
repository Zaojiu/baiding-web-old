import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject }        from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';
import { TimelineCommentModel } from './timeline-comment/timeline-comment.model';
import { TimelineCommentType } from './timeline-comment/timeline-comment.enum';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { MqService } from '../../shared/mq/mq.service';



@Injectable()
export class LiveRoomTimelineService {
  // Observable string sources
  private receivedMessageSource = new Subject<TimelineCommentModel>();
  private scrollerSource = new Subject<boolean>();
  private scrollToSource = new Subject<boolean>();
  private timelineSource = new Subject<boolean>();
  private praisesSource = new Subject<UserInfoModel>();
  // Observable string streams
  private receivedMessage$ = this.receivedMessageSource.asObservable();
  scroller$ = this.scrollerSource.asObservable();
  scrollTo$ = this.scrollToSource.asObservable();
  timeline$ = this.timelineSource.asObservable();
  private receivedPraises$ = this.praisesSource.asObservable();

  private receviedMessageSubscription: Subscription;
  private receviedPraisedUserSubscription: Subscription;

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
    console.log(comment)
    this.receivedMessageSource.next(comment);
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

  // startReceivePraisedUser() {
    // this.receviedPraisedUserSubscription = this.timelineService.receivedPraisedUser$.subscribe(
    //   praisedUser => {
    //     for (var comment of this.comments) {
    //       if (praisedUser.commentId == comment.id) {
    //         // 数组只保留5个，如果自己点过赞，则保留4个
    //         const limit = comment.hadPraised ? 4 : 5;
    //         if (comment.praisedAvatars.length >= limit) {
    //           comment.praisedAvatars.shift();
    //         }
    //         comment.praisedAmount += 1;
    //         comment.praisedAnimations.push(praisedUser);
    //         // 推入数组后会产生动画，动画完成后，由directive移除掉元素
    //         comment.praisedAvatars.push(praisedUser);
    //       }
    //     }
    //   }
    // );
  // }

  startReceive(id: string) {
    MqService.subscribeMessages(id, this.timelineSource)
    MqService.subscribePraises(id, this.praisesSource)

    // const praisedCommentId = '1234';
    // var index = 0;
    // var timer;

    // timer = setInterval(() => {
    //   if ( index>=5 ) {
    //     clearInterval(timer);
    //     return
    //   }

    //   let needInsert = index === 3;
    //   var user = new TimelineCommentUserInfoModel();
    //   user.uid = 1234;
    //   user.nick = 'test';
    //   user.avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
    //   user.role = TimelineCommentUserType.Host;

    //   var praisedUser = new PraisedUserModel();
    //   praisedUser.commentId = '1234';
    //   praisedUser.avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';

    //   var comment = new TimelineCommentModel();
    //   comment.id = needInsert ? '1234' : '2345';
    //   comment.user = user;
    //   comment.content = '打算打算打算的撒的撒打算打算打算的撒大大是打算打算打算打算打算打算打算的';
    //   comment.type = TimelineCommentType.Text;
    //   comment.hadPraised = needInsert;
    //   comment.praisedAmount = 101;
    //   comment.praisedAnimations = [praisedUser];
    //   comment.praisedAvatars = [praisedUser];
    //   comment.createdAt = '2006-01-02T15:04:05Z07:00';
    // this.receivedCommentSource.next(comment);

    //   index++
    // }, 500);

    // setInterval(() => {
    //   var praisedUser = new PraisedUserModel();
    //   praisedUser.uid = 1234;
      // praisedUser.avatar = 'https://www.gravatar.com/avatar/6119b06e8b42066dec1211a26ca99ba3?s=200';

    //   this.praisesSource.next(praisedUser);
    // }, 200);
  }

  stopReceive(id: string) {
    MqService.unsubscribeMessages(id)
    MqService.unsubscribePraises(id)

    if (this.receviedMessageSubscription) {
      this.receviedMessageSubscription.unsubscribe()
    }

    if (this.receviedPraisedUserSubscription) {
      this.receviedPraisedUserSubscription.unsubscribe()
    }
  }

  onReceivedMessage(f: any) {
    this.receviedMessageSubscription = this.receivedMessage$.subscribe(f)
  }

  onReceivedPraises(f: any) {
    this.receviedPraisedUserSubscription = this.receivedPraises$.subscribe(f)
  }
}
