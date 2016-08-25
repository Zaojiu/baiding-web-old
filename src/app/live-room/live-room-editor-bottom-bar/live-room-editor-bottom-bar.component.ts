import { Component }              from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'live-room-editor-bottom-bar',
  templateUrl: './live-room-editor-bottom-bar.component.html',
  styleUrls: ['./live-room-editor-bottom-bar.component.scss']
})

export class LiveRoomEditorBottomBarComponent implements OnInit {
  id: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
  }

  gotoPushComment() {
    this.router.navigate(['/lives/' + this.id + '/push-comment']);
  }

  gotoPostComment() {
    this.router.navigate(['/lives/' + this.id + '/post-comment']);
  }
}
