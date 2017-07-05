import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LiveInfoModel} from "../../../shared/api/live/live.model";
import {UserInfoModel} from "../../../shared/api/user-info/user-info.model";
import {UtilsService} from "../../../shared/utils/utils";
import {UserInfoService} from "../../../shared/api/user-info/user-info.service";

@Component({
  templateUrl: './view-info.component.html',
  styleUrls: ['./view-info.component.scss'],
})

export class ViewInfoComponent implements OnInit {
  liveId: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  isInApp = UtilsService.isInApp;

  constructor(private route: ActivatedRoute, private router: Router, private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();
  }

  gotoEdit() {
    this.router.navigate([`/lives/${this.liveId}/settings/edit-info`]);
  }
}
