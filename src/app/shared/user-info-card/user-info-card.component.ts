import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {UserInfoCardService} from './user-info-card.service';
import {UserPublicInfoModel} from "../api/user-info/user-info.model";
import {Router} from "@angular/router";
import {UserInfoService} from "../api/user-info/user-info.service";

@Component({
  selector: 'user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss']
})

export class UserInfoCardComponent implements OnInit {
  isPopup: boolean;
  publicUserInfo: UserPublicInfoModel;
  msgUserSub: Subscription;

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
    this.router.navigate([`info-center/${this.publicUserInfo.uid}`]);
  }
}
