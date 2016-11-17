import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {UserInfoService} from '../../shared/api/user-info/user-info.service';
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
  isLoading: boolean;
  isTokenExist = false;
  isTokenUsed: boolean;

  constructor(private userInfoService: UserInfoService, private liveService: LiveService,
              private route: ActivatedRoute, private router: Router, private inviteApiService: InviteApiService,
              private shareService: ShareBridge) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.token = this.route.snapshot.params['token'];

    let userInfoPromise = this.userInfoService.getUserInfo();
    let liveInfoPromise = this.liveService.getLiveInfo(this.liveId);

    this.isLoading = true;

    Promise.all([userInfoPromise, liveInfoPromise]).then((result: any[]) => {
      this.userInfo = result[0];
      this.liveInfo = result[1];


      if (this.token) {
        this.wechatShare(location.href);

        this.inviteApiService.checkInviteToken(this.token).then(isTokenUsed => {
          this.isTokenExist = true;
          this.isTokenUsed = isTokenUsed;
        });
      }

      this.isLoading = false;
    });
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
    this.shareService.share(`${this.liveInfo.subject}邀请函`, this.liveInfo.desc, this.liveInfo.coverSmallUrl, url)
  }
}
