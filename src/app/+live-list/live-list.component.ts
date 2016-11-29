import {Component} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {LiveStatus} from '../shared/api/live/live.enums';
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {UserInfoModel, UserPublicInfoModel} from "../shared/api/user-info/user-info.model";
import {UtilsService} from "../shared/utils/utils";
import {InvitationModel} from "../shared/api/invite/invite.model";
import {InviteApiService} from "../shared/api/invite/invite.api";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ShareBridge} from "../shared/bridge/share.interface";

@Component({
  templateUrl: './live-list.component.html',
  styleUrls: ['./live-list.component.scss'],
})

export class LiveListComponent {
  constructor(private router: Router,
              private liveService: LiveService, private userInfoService: UserInfoService,
              private sanitizer: DomSanitizer) {
  }

  timeNow = UtilsService.now.toString();
  timer: any;
  livesList: LiveInfoModel[];
  covers: {[liveId: string]: SafeUrl} = {};

  ngOnInit() {
    this.liveService.listLiveInfo(15421165063, '', 1000, ['-createdAt']).then((livesList) => {
      this.livesList = livesList;

      for (let liveInfo of this.livesList) {
        let coverUrl = liveInfo.coverSmallUrl ? liveInfo.coverSmallUrl : '/assets/img/liveroombanner-blur.jpg';
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(coverUrl);
      }
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

  gotoCreateOrApply() {
    this.userInfoService.getUserInfo().then(userInfo => {
      if (userInfo.canPublish) {
        this.router.navigate([`/lives/create`]);
      } else {
        this.router.navigate([`/lives/apply`]);
      }
    });
  }

  gotoLiveRoom(liveId: string) {
    this.router.navigate(([`/lives/${liveId}`]));
  }
}
