import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { PostDanmuService } from '../../shared/comment/post-danmu.service';
import { PostCommentService } from '../../shared/comment/post-comment.service';
import { GetCommentService } from '../../shared/comment/get-comment.service';
import { LiveRoomPostCommmentService } from './live-room-post-comment.service';
import { AdditionalContentModel } from './live-room-post-comment.model'

@Component({
  templateUrl: './live-room-post-comment.component.html',
  styleUrls: ['./live-room-post-comment.component.scss'],
  providers: [ PostDanmuService, PostCommentService, GetCommentService, LiveRoomPostCommmentService ]
})

export class LiveRoomPostCommentComponent implements OnInit {
  id: string;
  content = '';
  commentId: string;
  danmuId: string;
  additionalContent: AdditionalContentModel;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
    private postDanmuService: PostDanmuService, private postCommentService: PostCommentService,
    private liveRoomPostCommmentService: LiveRoomPostCommmentService) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
    this.commentId = this.route.snapshot.params['comment_id'];
    this.danmuId = this.route.snapshot.params['danmu_id'];

    if (this.commentId) {
      this.liveRoomPostCommmentService.getComment(this.id, this.commentId).then(additionalContent => {
        this.additionalContent = additionalContent
      })
    }

    if (this.danmuId) {
      this.liveRoomPostCommmentService.getDanmu(this.id, this.danmuId).then(additionalContent => {
        this.additionalContent = additionalContent
      })
    }
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }

  backToPushDanmu() {
    this.router.navigate([`/lives/${this.id}/push-danmu`]);
  }

  isEditor() { return this.liveService.isEditor(this.id); }

  isAudience() { return this.liveService.isAudience(this.id); }

  submit() {
    if (this.commentId) return this.postComment()

    if (this.danmuId) return this.pushDanmu()

    if (this.isEditor()) return this.postComment()

    if (!this.isEditor()) return this.postDanmu()
  }

  pushDanmu() {
    if (this.content === '') return

    this.postCommentService.postNiceComment(this.id, this.content, this.danmuId, this.additionalContent.user.uid, this.additionalContent.content).then(comment => {
      this.backToPushDanmu()
    });
  }

  postDanmu() {
    if (this.content === '') return

    this.postDanmuService.postDanmu(this.id, this.content).then(comment => {
      this.backToMainScreen()
    });
  }

  postComment() {
    if (this.content === '') return

    this.postCommentService.postTextComment(this.id, this.content, this.commentId).then(comment => {
      this.backToMainScreen()
    });
  }
}
