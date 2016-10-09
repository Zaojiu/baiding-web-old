import { Component, OnInit }      from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { MessageModel } from '../../shared/api/message.model';
import { MessageApiService } from "../../shared/api/message.api";
import { UserInfoModel } from "../../shared/user-info/user-info.model";
import { UserInfoService } from "../../shared/user-info/user-info.service";
import { SharePopupService } from "../../shared/share-popup/share-popup.service";

@Component({
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

export class HistoryComponent {
  id: string;
  token: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  messages: MessageModel[] = [];
  constructor(private liveService: LiveService, private userInfoService: UserInfoService,
              private route: ActivatedRoute, private router: Router,
              private messageApiService: MessageApiService, private shareService: SharePopupService) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
    this.token = this.route.parent.snapshot.params['token'];

    this.messageApiService.history(this.id).then(messages => {
      this.messages = messages;
    });

    this.userInfoService.getUserInfo().then(userInfo => this.userInfo = userInfo);
    this.liveService.getLiveInfo(this.id).then(liveInfo => this.liveInfo = liveInfo);
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }

  setPraised() {
    if (this.liveInfo.hadPraised) return;

    this.liveService.praiseLive(this.id).then(() => {
      this.liveService.getLiveInfo(this.id, true).then(liveInfo => this.liveInfo = liveInfo);
    });
  }

  popupShare() {
    this.shareService.popup();
  }
}