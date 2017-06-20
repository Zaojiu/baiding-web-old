import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {InviteApiService} from '../../shared/api/invite/invite.api';
import {UtilsService} from "../../shared/utils/utils";

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
              private router: Router, private inviteApiService: InviteApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.token = this.route.snapshot.params['token'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];

    if (UtilsService.isInApp) this.router.navigate([`/lives/${this.liveId}/invitation`, {token: this.token}]); // still needed?

    if (this.token) {
      this.setShareInfo();

      this.inviteApiService.getInviteToken(this.token).then(invitation => {
        this.isTokenExist = true;
        this.isTokenUsed = invitation.used;
        this.name = invitation.name;
      });
    }
  }

  acceptInvitation() {
    this.inviteApiService.acceptInvitation(this.liveId, this.token).then(() => {
      this.liveService.getLiveInfo(this.liveId, true).then(() => this.backToLive());
    });
  }

  backToLive() {
    this.router.navigate([`/lives/${this.liveId}`]);
  }

  getShareUri(): string {
    let uriTree = this.router.createUrlTree([`/lives/${this.liveId}/invitation`, {token: this.token}]);
    let path = this.router.serializeUrl(uriTree);
    return `${location.protocol}//${location.hostname}${path}`;
  }

  setShareInfo() {
    let diffSec = moment.unix(+moment(this.liveInfo.expectStartAt) / 1000).diff(moment.unix(UtilsService.now));
    let durationStr = moment.duration(diffSec).humanize();
    this.route.snapshot.data['shareTitle'] = `${this.userInfo.nick}邀请你加入#${this.liveInfo.subject}# `;
    this.route.snapshot.data['shareDesc'] = diffSec > 0 ? `${durationStr}后开始直播。${this.liveInfo.desc}` : `直播进行中。${this.liveInfo.desc}`;
    this.route.snapshot.data['shareCover'] = this.liveInfo.coverThumbnailUrl;
    this.route.snapshot.data['shareLink'] = this.getShareUri();
  }
}
