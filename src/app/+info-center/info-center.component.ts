import {Component} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {LiveStatus} from '../shared/api/live/live.enums';
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {UserInfoModel, UserPublicInfoModel} from "../shared/api/user-info/user-info.model";
import {SharePopupService} from "../shared/share-popup/share-popup.service";
import {UtilsService} from "../shared/utils/utils";
import {InvitationModel} from "../shared/api/invite/invite.model";
import {InviteApiService} from "../shared/api/invite/invite.api";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ShareBridge} from "../shared/bridge/share.interface";
import {TimeToPipe} from '../../app/shared/pipe/time.pipe';

@Component({
  templateUrl: './info-center.component.html',
  styleUrls: ['./info-center.component.scss'],
})

export class InfoCenterComponent {
  constructor(private router: Router, private route: ActivatedRoute,
              private liveService: LiveService, private userInfoService: UserInfoService,
              private shareService: ShareBridge, private inviteApiService: InviteApiService,
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
    this.currentUserInfo = this.route.snapshot.data['userInfo'];
    this.uid = +this.route.snapshot.params['uid'] || this.currentUserInfo.uid;

    this.liveService.listLiveInfo(this.uid, '', 1000, ['-createdAt']).then((livesList) => {
      this.livesList = livesList;

      for (let liveInfo of this.livesList) {
        this.liveService.listLiveAudience(liveInfo.id).then((audienceList) => {
          liveInfo.audienceList = audienceList;
        });

        if (liveInfo.isAdmin(this.currentUserInfo.uid)) {
          this.inviteApiService.listInvitations(liveInfo.id).then((invitionWithToken) => {
            let invitees = [];
            // 过滤掉已经接受邀请的
            for (let invitee of invitionWithToken) {
              if (!invitee.userInfo) invitees.push(invitee);
            }
            this.invitees[liveInfo.id] = invitees;
          });
        } else {
          this.inviteApiService.audienceListInvitations(liveInfo.id).then((invitionWithoutToken) => {
            let invitees = [];
            // 过滤掉已经接受邀请的
            for (let invitee of invitionWithoutToken) {
              if (!invitee.userInfo) invitees.push(invitee);
            }
            this.invitees[liveInfo.id] = invitees;
          });
        }

        let coverUrl = liveInfo.coverSmallUrl ? liveInfo.coverSmallUrl : '/assets/img/liveroombanner-blur.jpg';
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(coverUrl);
      }
    });

    this.userInfoService.getUserPublicInfo(this.uid).then((pageUserInfo) => {
      this.pageUserInfo = pageUserInfo;
    });

    this.timer = setInterval(() => {
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
    this.router.navigate([`/info-center/edit-info`]);
  }

  popupShare() {
    this.shareService.share();
  }

  goInvitation(liveId: string, pageUserId: string) {
    this.router.navigate([`/lives/${liveId}/vip-info`, {fromInfoCenter: 'fromInfoCenter', pageUserId: pageUserId}]);
  }

  goEditLiveRoom(liveId: string, pageUserId: string) {
    this.router.navigate([`/lives/${liveId}/settings/edit-info`, {
      fromInfoCenter: 'fromInfoCenter',
      pageUserId: pageUserId,
    }]);
  }

  gotoCreateOrApply() {
    if (this.currentUserInfo.canPublish) {
      this.router.navigate([`/lives/create`]);
    } else {
      this.router.navigate([`/lives/apply`]);
    }
  }

  liveRoomStatusHumanize(liveStatus: number): string {
    switch (liveStatus) {
      case LiveStatus.Created:
        return '开始时间';
      case LiveStatus.Started:
        return '已进行';
      case LiveStatus.Ended:
        return '直播时长';
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
