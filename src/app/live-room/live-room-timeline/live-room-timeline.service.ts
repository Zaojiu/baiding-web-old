import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject }        from 'rxjs/Subject';
import { TimelineCommentModel, TimelineCommentUserInfoModel, PraisedUserModel } from './timeline-comment/timeline-comment.model';
import { TimelineCommentUserType, TimelineCommentType } from './timeline-comment/timeline-comment.enum';

@Injectable()
export class LiveRoomTimelineService {
  // Observable string sources
  private receivedCommentSource = new Subject<TimelineCommentModel>();
  // Observable string streams
  receivedComment$ = this.receivedCommentSource.asObservable();

  constructor (private http: Http) {}

  onReceive () {
    setInterval(() => {
      var user = new TimelineCommentUserInfoModel();
      user.uid = 1234;
      user.nick = 'test';
      user.avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
      user.role = TimelineCommentUserType.Host;

      var praisedUser = new PraisedUserModel()
      praisedUser.avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';

      var comment = new TimelineCommentModel();
      comment.user = user;
      comment.content = '打算打算打算的撒的撒打算打算打算的撒大大是打算打算打算打算打算打算打算的';
      comment.type = TimelineCommentType.Text;
      comment.hadPraised = true;
      comment.praisedAmout = 101;
      comment.praisedAnimations = [praisedUser];
      comment.praisedAvatars = [praisedUser];
      comment.createdAt = '2006-01-02T15:04:05Z07:00';
      this.receivedCommentSource.next(comment);
    }, 500);
  }
}
