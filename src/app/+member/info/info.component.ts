import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {ActivatedRoute} from "@angular/router";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {host} from "../../../environments/environment";

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  userInfo: UserInfoModel;
  isSuccess: boolean;
  bg: SafeStyle;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer,
              private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.userInfo = this.userInfoService.getUserInfoCache();
    this.bg = this.sanitizer.bypassSecurityTrustStyle(`url('${host.assets}/assets/img/member-activate-background.png')`);
    this.isSuccess = !!this.route.snapshot.queryParams['success'];
  }
}
