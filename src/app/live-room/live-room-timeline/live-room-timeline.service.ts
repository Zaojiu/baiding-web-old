import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject }        from 'rxjs/Subject';
import { TimelineCommentModel } from './timeline-comment/timeline-comment.model';
import { TimelineCommentType } from './timeline-comment/timeline-comment.enum';

@Injectable()
export class LiveRoomTimelineService {
  // Observable string sources
  private receivedCommentSource = new Subject<TimelineCommentModel>();
  private scrollerSource = new Subject<boolean>();
  private scrollToSource = new Subject<boolean>();
  private timelineSource = new Subject<boolean>();
  // private receivedPraisedUserSource = new Subject<PraisedUserModel>();
  // Observable string streams
  receivedComment$ = this.receivedCommentSource.asObservable();
  scroller$ = this.scrollerSource.asObservable();
  scrollTo$ = this.scrollToSource.asObservable();
  timeline$ = this.timelineSource.asObservable();
  // receivedPraisedUser$ = this.receivedPraisedUserSource.asObservable();

  constructor (private http: Http) {}

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
    this.receivedCommentSource.next(comment);
  }

  // pushPraisedUser(praisedUser: PraisedUserModel) {
  //   this.receivedCommentSource.next(praisedUser);
  // }

  onReceive () {
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
    //   this.receivedCommentSource.next(comment);

    //   index++
    // }, 500);

    // setInterval(() => {
    //   var praisedUser = new PraisedUserModel();
    //   praisedUser.uid = 1234;
    //   praisedUser.commentId = '1234';
    //   praisedUser.avatar = 'https://www.gravatar.com/avatar/6119b06e8b42066dec1211a26ca99ba3?s=200';

    //   this.receivedPraisedUserSource.next(praisedUser);
    // }, 200);
  }
}
