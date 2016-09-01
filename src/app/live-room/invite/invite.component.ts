import { Component, OnInit }      from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';

@Component({
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})

export class InviteComponent implements OnInit {
  id: string;
  liveInfo: LiveInfoModel;
  constructor(private liveRoomService: LiveService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
  }
}
