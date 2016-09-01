import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';

@Component({
  templateUrl: './live-room-post-comment.component.html',
  styleUrls: ['./live-room-post-comment.component.scss']
})

export class LiveRoomPostCommentComponent implements OnInit {
  id: string;
  liveInfo: LiveInfoModel;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService) {}

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

  }
}
