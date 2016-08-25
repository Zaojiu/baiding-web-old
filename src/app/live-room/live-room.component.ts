import { Component }      from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.scss']
})

export class LiveRoomComponent implements OnInit {
  id: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
  }
}
