import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {UserInfoCardService} from './user-info-card.service';
import {UserPublicInfoModel} from "../api/user-info/user-info.model";
import {Router} from "@angular/router";
import {UserInfoService} from "../api/user-info/user-info.service";
import {UtilsService} from "../utils/utils";

@Component({
  selector: 'user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss']
})

export class UserInfoCardComponent implements OnInit {
  isPopup: boolean;
  publicUserInfo: UserPublicInfoModel;
  msgUserSub: Subscription;
  isInApp = UtilsService.isInApp;

  constructor(private userInfoCardService: UserInfoCardService, private userInfoService: UserInfoService,
              private router: Router) {
  }

  ngOnInit() {
    this.msgUserSub = this.userInfoCardService.popup$.subscribe(uid => {
      this.userInfoService.getUserPublicInfo(uid).then(publicUserInfo => {
        this.publicUserInfo = publicUserInfo;
        this.isPopup = true;
      });
    });
  }

  gotoInfoCenter() {
    if (!this.isInApp) this.router.navigate([`info-center/${this.publicUserInfo.uid}`]);
  }
}
