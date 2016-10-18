import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import { CommentApiService } from '../../shared/api/comment/comment.service'
import { PushCommentService } from './push-comment.service'
import { LiveService } from '../../shared/api/live/live.service';
import { UserInfoService } from '../../shared/api/user-info/user-info.service';
import { CommentModel } from '../../shared/api/comment/comment.model'
import { UserInfoModel } from '../../shared/api/user-info/user-info.model';
import { LiveInfoModel } from '../../shared/api/live/live.model';

@Component({
  templateUrl: './push-comment.component.html',
  styleUrls: ['./push-comment.component.scss'],
  providers: [ CommentApiService, PushCommentService, UserInfoService, LiveService ]
})

export class PushCommentComponent implements OnInit, OnDestroy {
  liveId: string;
  comments: CommentModel[] = [];
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  scrollSubscription: Subscription;
  isOnLatest: boolean;
  isOnNewest: boolean;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private commentApiService: CommentApiService,
              private pushCommentService: PushCommentService, private userInfoService: UserInfoService,
              private liveService: LiveService) {}

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    let userInfoPromise = this.userInfoService.getUserInfo();
    let liveInfoPromise = this.liveService.getLiveInfo(this.liveId);

    Promise.all([userInfoPromise, liveInfoPromise]).then((result:any[]) => {
        this.userInfo = result[0];
        this.liveInfo = result[1];

        this.gotoFirstComments();
        this.startObserveTimelineScroll();
      });
  }

  ngOnDestroy() {
    this.stopObserveTimelineScroll();
  }

  gotoFirstComments() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, '', 20, ['createdAt']).then(comments => {
      this.comments = comments;
      this.isOnNewest = true;
      this.isOnLatest = false;
      this.isLoading = false;
    });
  }

  getNextComments(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, marker, limit, sorts).then(comments => {
      for (let comment of comments) {
        this.comments.push(comment);
      }

      if (comments.length === 0) {
        this.isOnLatest = true;
      }

      this.isLoading = false;
    });
  }

  getPrevComments(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, marker, limit, sorts).then(comments => {
      for (let comment of comments) {
        this.comments.unshift(comment);
      }

      if (comments.length === 0) {
        this.isOnNewest = true;
      }

      this.isLoading = false;
    });
  }

  startObserveTimelineScroll() {
    this.scrollSubscription = this.pushCommentService.scroller$.subscribe(
      topOrBottom => {
        if (topOrBottom) {
          if (this.comments.length === 0) return;
          let firstComment = this.comments[0];
          this.getPrevComments(`$lt${firstComment.createdAt}`, 20, ['-createdAt']);
        } else {
          if (this.comments.length === 0) return;
          let lastComment = this.comments[this.comments.length-1];
          this.getNextComments(`$gt${lastComment.createdAt}`, 20, ['createdAt']);
        }
      }
    );
  }

  stopObserveTimelineScroll() {
    this.scrollSubscription.unsubscribe();
  }

  pushComment(comment: CommentModel) {
    this.router.navigate([`/lives/${this.liveId}/post`, {'comment_id': comment.id}]);
  }
}
