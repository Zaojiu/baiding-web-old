import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {LiveInfoModel} from '../../shared/live/live.model';
import {LiveService} from '../../shared/live/live.service';
import {UserInfoModel} from '../../shared/user-info/user-info.model';
import {CommentApiService} from "../../shared/api/comment.service";

@Component({
  selector: 'audience-bottom-bar',
  templateUrl: './audience-bottom-bar.component.html',
  styleUrls: ['./audience-bottom-bar.component.scss'],
  providers: [CommentApiService]
})

export class AudienceBottomBarComponent {
  id: string;
  @Input() isOnLatest: boolean;
  @Input() isOnNewest: boolean;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  commentContent: string;
  isOnComment: boolean;
  isOnCommentRequest: boolean;
  isOnPraiseRequest: boolean;

  constructor(private route: ActivatedRoute, private liveService: LiveService, private commentApiService: CommentApiService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
  }

  postComment() {
    if (this.commentContent === '') return;
    if (this.isOnCommentRequest) return;

    this.isOnCommentRequest = true;

    this.commentApiService.postComment(this.id, this.commentContent).then(() => {
      this.switchToNormal();
      this.isOnCommentRequest = false;
    });
  }

  cleanCommentContent() {
    this.commentContent = '';
  }

  switchToComment() {
    if (this.isOnComment) return;

    this.isOnComment = true;
  }

  switchToNormal() {
    if (!this.isOnComment) return;

    this.cleanCommentContent();
    this.isOnComment = false;
  }

  confirmPraise() {
    if (!this.liveInfo.hadPraised) {
      if (this.isOnPraiseRequest) return;

      this.isOnPraiseRequest = true;
      this.liveService.praiseLive(this.liveInfo.id).then(() => this.isOnPraiseRequest = false);

      this.liveInfo.hadPraised = true;
      this.liveInfo.praised += 1;
    }

    this.liveInfo.praisedAnimations.push(this.userInfo);
  }
}
