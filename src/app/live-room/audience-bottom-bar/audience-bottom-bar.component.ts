import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { TimelineService } from '../timeline/timeline.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { LiveService } from '../../shared/live/live.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { CommentApiService } from "../../shared/api/comment.service";
import { UserAnimEmoji } from '../../shared/praised-animation/praised-animation.model';
import { MqEvent, EventType } from '../../shared/mq/mq.service';

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
  praisedSub: Subscription;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private liveService: LiveService, private commentApiService: CommentApiService,
    private timelineService: TimelineService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.praisedSub = this.timelineService.event$.subscribe((evt: MqEvent) => {
      if (evt.event != EventType.LivePraise) {
        return
      }
      if (evt.info.user.uid == this.userInfo.uid) {
        return
      }
      let userAnim = new UserAnimEmoji;
      userAnim.emoji = evt.info.emoji;
      userAnim.user = new UserInfoModel;
      this.liveInfo.praisedAnimations.push(userAnim);
    })
  }

  ngOnDestroy() {
    this.praisedSub.unsubscribe();
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

  confirmPraise(emoji: string) {
    let userAnim = new UserAnimEmoji;
    userAnim.user = this.userInfo
    userAnim.emoji = emoji;
    this.liveInfo.praisedAnimations.push(userAnim);

    if (this.isLoading) return;

    this.isLoading = true;
    this.liveService.praiseLive(this.liveInfo.id, this.liveInfo.hadPraised, emoji).then(() => this.isLoading = false);

    this.liveInfo.hadPraised = true;
    this.liveInfo.praised += 1;
  }
}
