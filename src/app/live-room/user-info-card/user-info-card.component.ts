import {Input, Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {UserInfoCardService} from './user-info-card.service';
import {LiveInfoModel} from "../../shared/api/live/live.model";
import { UserPublicInfoModel} from "../../shared/api/user-info/user-info.model";
import {UserSex} from "../../shared/api/user-info/user-info.model";
@Component({
  selector: 'user-info-card',
  templateUrl: 'user-info-card.component.html',
  styleUrls: ['user-info-card.component.scss']
})

export class UserInfoCardComponent implements OnInit {
  isPopup: boolean;
  @Input() liveInfo: LiveInfoModel;
  msgUser: UserPublicInfoModel;
  msgUserSub: Subscription;

  constructor(private editorCardService: UserInfoCardService) {
  }

  ngOnInit() {
    this.msgUserSub = this.editorCardService .popup$.subscribe((user) => {
        this.isPopup = true;
        this.msgUser = user;
      }
    );
  }
}
