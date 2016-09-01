import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveRoomInfoModel } from '../live-room.model';

@Component({
  templateUrl: './live-room-post-comment.component.html',
  styleUrls: ['./live-room-post-comment.component.scss']
})

export class LiveRoomPostCommentComponent implements OnInit {
  id: string;
  @Input() liveInfo: LiveRoomInfoModel;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }

  postComment() {

  }
}
