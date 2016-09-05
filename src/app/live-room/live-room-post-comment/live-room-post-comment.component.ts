import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { PostDanmuService } from '../../shared/comment/post-danmu.service';
import { PostCommentService } from '../../shared/comment/post-comment.service';

@Component({
  templateUrl: './live-room-post-comment.component.html',
  styleUrls: ['./live-room-post-comment.component.scss'],
  providers: [ PostDanmuService, PostCommentService ]
})

export class LiveRoomPostCommentComponent implements OnInit {
  id: string;
  content: string;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
    private postDanmuService: PostDanmuService, private postCommentService: PostCommentService) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }

  isEditor() { return this.liveService.isEditor(this.id); }

  isAudience() { return this.liveService.isAudience(this.id); }

  submit() {
    if (this.isEditor()) {
      this.postComment();
    } else {
      this.postDanmu();
    }
  }

  postDanmu() {
    if (this.content === '') return;

    this.postDanmuService.postDanmu(this.id, this.content).then(comment => {
      this.backToMainScreen();
    });
  }

  postComment() {
    if (this.content === '') return;

    this.postCommentService.postTextComment(this.id, this.content).then(comment => {
      this.backToMainScreen();
    });
  }
}
