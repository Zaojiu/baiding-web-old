import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {InviteApiService} from '../../shared/api/invite/invite.api';
import {ShareBridge} from "../../shared/bridge/share.interface";

@Component({
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  providers: [InviteApiService]
})

export class InviteComponent implements OnInit {
  liveId: string;
  token: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  isTokenExist = false;
  isTokenUsed: boolean;
  name = '';

  constructor(private liveService: LiveService, private route: ActivatedRoute,
              private router: Router, private inviteApiService: InviteApiService, private shareService: ShareBridge) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.token = this.route.snapshot.params['token'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];

    if (this.token) {
      this.wechatShare(location.href);

      this.inviteApiService.getInviteToken(this.token).then(invitation => {
        this.isTokenExist = true;
        this.isTokenUsed = invitation.used;
        this.name = invitation.name;
      });
    }
  }

  acceptInvitation() {
    this.inviteApiService.acceptInvitation(this.liveId, this.token).then(
      () => {
        this.liveService.getLiveInfo(this.liveId, true).then(() => this.backToLive());
      }
    );
  }

  backToLive() {
    this.router.navigate([`/lives/${this.liveId}`]);
  }

  createTokenUrl(token: string) {
    return this.router.serializeUrl(this.router.createUrlTree([`/lives/${this.liveId}/invitation`, {token: token}]))
  }

  wechatShare(url: string) {
    this.shareService.setShareInfo(`${this.liveInfo.subject}邀请函`, this.liveInfo.desc, this.liveInfo.coverSmallUrl, url)
  }
}
