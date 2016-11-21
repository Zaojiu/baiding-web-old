import {Component, OnInit, OnDestroy}      from '@angular/core';
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'notfound.component.html',
  styleUrls: ['notfound.component.scss'],
})

export class NotFoundComponent {
  constructor(private router: Router, private userInfoService: UserInfoService) {
  }

  gotoInfoCenter() {
    this.userInfoService.getUserInfo().then(userInfo => {
      this.router.navigate([`/info-center/${userInfo.uid}`]);
    });

  }
}
