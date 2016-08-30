import { Component, Input } from '@angular/core';
import { TimelineCommentModel, PraisedUserModel } from './timeline-comment.model';
import { UserInfoModel } from '../../../shared/user-info/user-info.model';

@Component({
  selector: 'timeline-comment',
  templateUrl: './timeline-comment.component.html',
  styleUrls: ['./timeline-comment.component.scss'],
})

export class TimelineCommentComponent {
  @Input() comment: TimelineCommentModel;
  @Input() userInfo: UserInfoModel;

  constructor() {}

  public get getPraisedAvatars() {
    return this.comment.praisedAvatars.filter((item, index) => index < (this.comment.hadPraised ? 4 : 5) )
  }

  confirmThumbsUp() {
    var praisedUser = new PraisedUserModel();
    praisedUser.uid = '12345';
    praisedUser.commentId = '1234';
    praisedUser.avatar = 'https://www.gravatar.com/avatar/6119b06e8b42066dec1211a26ca99ba3?s=200';

    this.comment.hadPraised = true;
    this.comment.praisedAmout += 1;
    this.comment.praisedAnimations.push(praisedUser);
  }

  cancelThumbsUp() {
    this.comment.hadPraised = false;
    this.comment.praisedAmout -= 1;
  }

  setThumbsUp() {
    if (!this.comment.hadPraised) {
      this.confirmThumbsUp();
    } else {
      this.cancelThumbsUp();
    }
  }
}
