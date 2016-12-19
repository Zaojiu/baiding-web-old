import {Component}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {MessageModel} from '../../shared/api/message/message.model';
import {MessageApiService} from "../../shared/api/message/message.api";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {ShareBridge} from "../../shared/bridge/share.interface";

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
              private messageApiService: MessageApiService, private shareBridge: ShareBridge) {
  }

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
    this.token = this.route.parent.snapshot.params['token'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.messageApiService.history(this.id).then(messages => {
      this.messages = messages;
    }, () => {
      this.backToMainScreen();
    });
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }

  setPraised() {
    if (this.liveInfo.hadPraised) return;

    this.liveService.praiseLive(this.id, this.liveInfo.hadPraised).then(liveInfo => {
      this.liveInfo = liveInfo;
    });
  }

  fireShare() {
    this.shareBridge.share();
  }
}
