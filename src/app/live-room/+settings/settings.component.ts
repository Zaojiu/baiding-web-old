import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {LiveService} from '../../shared/api/live/live.service';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {ModalService} from '../../shared/modal/modal.service';
import {InviteApiService} from '../../shared/api/invite/invite.api';
import {InvitationModel, AudienceInvitationModel} from '../../shared/api/invite/invite.model';
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {WechatConfigService} from "../../shared/wechat/wechat.service";
import {LiveRoomService} from "../live-room.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {UtilsService} from "../../shared/utils/utils";

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
  isInApp = UtilsService.isInApp;

  constructor(private route: ActivatedRoute, private router: Router,
              private liveService: LiveService, private wechatService: WechatConfigService,
              private modalService: ModalService, private inviteApiService: InviteApiService,
              private liveRoomService: LiveRoomService, private operationTips: OperationTipsService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];

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
    return this.liveRoomService.isAudioAutoPlay(this.liveId);
  }

  set audioAutoPlay(result: boolean) {
    this.liveRoomService.toggleAudioAutoPlay(this.liveId);
  }

  get translationExpanded(): boolean {
    return this.liveRoomService.isTranslationCollapse(this.liveId);
  }

  set translationExpanded(result: boolean) {
    this.liveRoomService.toggleTranslationCollapse(this.liveId);
  }

  get isAdmin() {
    return this.liveInfo.isAdmin(this.userInfo.uid);
  }

  gotoInvitationInfo() {
    this.router.navigate([`lives/${this.liveId}/vip-info`]);
  }

  gotoRoomInfo() {
    this.router.navigate([`lives/${this.liveId}/settings/view-info`]);
  }

  gotoCreateOrApply() {
    if (this.userInfo.canPublish) {
      this.router.navigate([`lives/create`, {liveId: this.liveId}]);
    } else {
      this.router.navigate([`lives/apply`, {from: encodeURIComponent(`lives/${this.liveId}`)}]);
    }
  }

  gotoInvitation(token: string) {
    this.router.navigate([`lives/${this.liveId}/invitation`, {token: token}]);
  }

  gotoInfoCenter() {
    this.router.navigate([`info-center/${this.userInfo.uid}`]);
  }

  closeWindow() {
    this.wechatService.closeWindow();
  }

  closeLive() {
    this.modalService.popup('确定结束话题吗?', '取消', '确定').then((result) => {
      if (!result) return;
      this.liveService.closeLive(this.liveId).then(liveInfo => {
        this.liveInfo = liveInfo;
        this.operationTips.popup('话题已结束');
      });
    });
  }
}
