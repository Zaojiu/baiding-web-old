import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {LiveStatus} from '../shared/api/live/live.enums';
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {UserInfoModel, UserPublicInfoModel, UserDetailInfoModel} from "../shared/api/user-info/user-info.model";
import {SharePopupService} from "../shared/share-popup/share-popup.service";
import {UtilsService} from "../shared/utils/utils";

@Component({
  templateUrl: './info-center.component.html',
  styleUrls: ['./info-center.component.scss'],
})

export class InfoCenterComponent {
  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService, private userInfoService: UserInfoService, private shareService: SharePopupService) {
  }

  liveId: string;
  timeNow = UtilsService.now.toString();
  timer: any;
  pageUserInfo: UserPublicInfoModel;
  currentUserInfo: UserInfoModel;
  livesList: LiveInfoModel[];
  uid: number;

  ngOnInit() {
    this.uid = +this.route.snapshot.params['uid'];

    Promise.all([
      this.liveService.listLiveInfo(this.uid),
      this.userInfoService.getUserInfo(),
      this.userInfoService.getUserPublicInfo(this.uid),
    ]).then((result) => {
      this.livesList = result[0];
      this.currentUserInfo = result[1];
      this.pageUserInfo = result[2];
    }, (err) => {
      this.router.navigate(['404']);
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
    if (this.currentUserInfo.uid === this.pageUserInfo.uid) {
      return true
    } else {
      return false
    }
  }

  goToEdit() {
    this.router.navigate([`/info-center/${this.currentUserInfo.uid}/edit-info`, {'uid': this.currentUserInfo.uid.toString()}]);
  }

  isAudience() {
    this.liveService.isAudience(this.liveId, this.currentUserInfo.uid);
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
    //TODO
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

}
