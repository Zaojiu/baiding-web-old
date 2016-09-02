import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { PostCommentService } from '../../shared/comment/post-comment.service';

@Component({
  templateUrl: './live-room-post-comment.component.html',
  styleUrls: ['./live-room-post-comment.component.scss'],
  providers: [ PostCommentService ]
})

export class LiveRoomPostCommentComponent implements OnInit {
  id: string;
  liveInfo: LiveInfoModel;
  content: string;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService, private postCommentService: PostCommentService) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
  }

  getLiveInfo() {
    this.liveService.getLiveInfo(this.id).then(info => this.liveInfo = info);
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }

  postComment() {
    if (this.content === '') return;

    this.postCommentService.postTextComment(this.id, this.content).then(comment => {
      console.log(comment);
      this.backToMainScreen();
    });
  }
}
