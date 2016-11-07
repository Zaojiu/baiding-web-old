import {Component, OnInit, DoCheck} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LiveInfoModel} from "../../../shared/api/live/live.model";
import {LiveService} from "../../../shared/api/live/live.service";

@Component({
  templateUrl: './view-info.component.html',
  styleUrls: ['./view-info.component.scss'],
})

export class ViewInfoComponent implements OnInit {
  liveId: string;
  liveInfo: LiveInfoModel;

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
  }

  get isAdmin() {
    return this.liveService.isAdmin(this.liveId);
  }

  gotoEdit() {
    this.router.navigate([`/lives/${this.liveId}/settings/edit-info`]);
  }
}
