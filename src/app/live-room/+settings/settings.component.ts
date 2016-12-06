import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveStatus} from '../../shared/api/live/live.enums';
import {ModalService} from '../../shared/modal/modal.service';
import {InviteApiService} from '../../shared/api/invite/invite.api';
import {InvitationModel, AudienceInvitationModel} from '../../shared/api/invite/invite.model';
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {WechatConfigService} from "../../shared/wechat/wechat.service";

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [InviteApiService],
})

export class SettingsComponent implements OnInit {
  liveId: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  invitations: InvitationModel[];
  audienceListInvitations: AudienceInvitationModel[];

  constructor(private route: ActivatedRoute, private router: Router,
              private liveService: LiveService, private wechatService: WechatConfigService,
              private modalService: ModalService, private inviteApiService: InviteApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.liveService.getLiveInfo(this.liveId, true).then(liveInfo => {
      this.liveInfo = liveInfo;
    });

    if (this.isAdmin) {
      this.inviteApiService.listInvitations(this.liveId).then((res) => {
        this.invitations = res;
      });
    } else {
      this.inviteApiService.audienceListInvitations(this.liveId).then((res) => {
        this.audienceListInvitations = res;
      });
    }
  }

  get audioAutoPlay() {
    return this.liveService.isAudioAutoPlay(this.liveId);
  }

  set audioAutoPlay(result: boolean) {
    this.liveService.toggleAudioAutoPlay(this.liveId);
  }

  get translationExpanded(): boolean {
    return this.liveService.isTranslationExpanded(this.liveId);
  }

  set translationExpanded(result: boolean) {
    this.liveService.toggleTranslationExpanded(this.liveId);
  }

  get isAdmin() {
    return this.liveService.isAdmin(this.liveId);
  }

  gotoInvitationInfo() {
    this.router.navigate([`/lives/${this.liveId}/vip-info`]);
  }

  gotoRoomInfo() {
    this.router.navigate([`/lives/${this.liveId}/settings/view-info`]);
  }

  gotoCreateOrApply() {
    if (this.userInfo.canPublish) {
      this.router.navigate([`/lives/create`, {liveId: this.liveId}]);
    } else {
      this.router.navigate([`/lives/apply`, {from: encodeURIComponent(`/lives/${this.liveId}`)}]);
    }
  }

  gotoInvitation(token: string) {
    this.router.navigate([`/lives/${this.liveId}/invitation`, {token: token}]);
  }

  gotoInfoCenter() {
    this.router.navigate([`/info-center/${this.userInfo.uid}`]);
  }

  closeWindow() {
    this.wechatService.closeWindow();
  }

  closeLive() {
    this.modalService.popup('确定结束话题吗?', '取消', '确定').then((result) => {
      if (!result) return;
      this.liveService.closeLive(this.liveId).then(() => {
        this.liveService.getLiveInfo(this.liveId, true).then(liveInfo => this.liveInfo = liveInfo);
      });
    });
  }
}
