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
  liveStatusEnums = LiveStatus;
  invitations: InvitationModel[];
  audienceListInvitations: AudienceInvitationModel[];

  constructor(private route: ActivatedRoute, private router: Router,
              private liveService: LiveService, private wechatService: WechatConfigService,
              private modalService: ModalService, private inviteApiService: InviteApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    if (this.isAdmin) {
      this.inviteApiService.listInvitations(this.liveId).then((res)=> {
        this.invitations = res;
      });
    }else{
      this.inviteApiService.audienceListInvitations(this.liveId).then((res)=>{
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

  get translationExpanded(): boolean{
    return this.liveService.isTranslationExpanded(this.liveId);
  }

  set translationExpanded(result: boolean){
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

  gotoCreate() {
    this.router.navigate([`/lives/create`]);
  }

  gotoInvitation(token: string) {
    this.router.navigate(([`/lives/${this.liveId}/invitation`, {token: token}]));
  }

  closeWindow() {
    this.wechatService.closeWindow();
  }

  closeLive() {
    this.modalService.popup('确定结束直播吗?', '取消', '确定').then((result)=> {
      if (!result) return;
      this.liveService.closeLive(this.liveId);
      this.liveService.getLiveInfo(this.liveId, true).then(liveInfo => this.liveInfo = liveInfo);
    });
  }
}
