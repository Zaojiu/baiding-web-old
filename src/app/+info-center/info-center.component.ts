import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {LiveStatus} from '../shared/api/live/live.enums';
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {UserInfoModel, UserPublicInfoModel, UserDetailInfoModel} from "../shared/api/user-info/user-info.model";
import {SharePopupService} from "../shared/share-popup/share-popup.service";
import {UtilsService} from "../shared/utils/utils";
import {InvitationModel} from "../shared/api/invite/invite.model";
import {InviteApiService} from "../shared/api/invite/invite.api";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  templateUrl: './info-center.component.html',
  styleUrls: ['./info-center.component.scss'],
})

export class InfoCenterComponent {
  constructor(private router: Router, private route: ActivatedRoute,
              private liveService: LiveService, private userInfoService: UserInfoService,
              private shareService: SharePopupService, private inviteApiService: InviteApiService,
              private sanitizer: DomSanitizer) {
  }

  timeNow = UtilsService.now.toString();
  timer: any;
  pageUserInfo: UserPublicInfoModel;
  currentUserInfo: UserInfoModel;
  livesList: LiveInfoModel[];
  uid: number;
  invitees: {[liveId: string]: InvitationModel[]} = {};
  covers: {[liveId: string]: SafeUrl} = {};

  ngOnInit() {
    this.uid = +this.route.snapshot.params['uid'];

    this.liveService.listLiveInfo(this.uid).then((livesList) => {
      this.livesList = livesList;

      for (let liveInfo of this.livesList) {
        this.liveService.listLiveAudience(liveInfo.id).then((audienceList) => {
          liveInfo.audienceList = audienceList;
        });

        if (liveInfo.isAdmin(this.currentUserInfo.uid)) {
          this.inviteApiService.listInvitations(liveInfo.id).then((invitionWithToken) => {
            this.invitees[liveInfo.id] = invitionWithToken;
          });
        } else {
          this.inviteApiService.audienceListInvitations(liveInfo.id).then((invitionWithoutToken) => {
            this.invitees[liveInfo.id] = invitionWithoutToken;
          });
        }

        let coverUrl = liveInfo.coverSmallUrl ? liveInfo.coverSmallUrl : '/assets/img/liveroombanner-blur.jpg';
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(coverUrl);
      }
    });

    this.userInfoService.getUserInfo().then((currentUserInfo) => {
      this.currentUserInfo = currentUserInfo;
    });

    this.userInfoService.getUserPublicInfo(this.uid).then((pageUserInfo) => {
      this.pageUserInfo = pageUserInfo;
    });

    this.timer = setInterval(()=> {
      this.timeNow = UtilsService.now.toString();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get isSelf(): boolean {
    return this.currentUserInfo.uid === this.pageUserInfo.uid;
  }

  goToEdit() {
    this.router.navigate([
      `/info-center/edit-info`,
    ]);
  }

  popupShare() {
    this.shareService.popup();
  }

  goInvitation(liveId: string) {
    this.router.navigate([`/lives/${liveId}/vip-info`]);
  }

  goEditLiveRoom(liveId: string) {
    this.router.navigate([`/lives/${liveId}/settings/edit-info`]);
  }

  goToCreateNewRoom() {
    this.router.navigate([`/lives/create`]);
  }

  liveRoomStatusHumanize(liveStatus: number): string {
    switch (liveStatus) {
      case LiveStatus.Created:
        return '倒计时';
      case LiveStatus.Started:
        return '直播中';
      case LiveStatus.Ended:
        return '直播结束';
      default:
        return '未知状态';
    }
  }

  gotoInvitation(liveId: string, invitee: InvitationModel) {
    if (invitee.token) this.router.navigate(([`/lives/${liveId}/invitation`, {token: invitee.token}]));
  }

  gotoLiveRoom(liveId: string) {
    this.router.navigate(([`/lives/${liveId}`]));
  }
}
