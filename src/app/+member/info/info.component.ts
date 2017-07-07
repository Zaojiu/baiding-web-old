import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {ActivatedRoute} from "@angular/router";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  userInfo: UserInfoModel;
  isSuccess: boolean;

  constructor(private route: ActivatedRoute,
              private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.userInfo = this.userInfoService.getUserInfoCache();
    this.isSuccess = !!this.route.snapshot.queryParams['success'];
  }
}
