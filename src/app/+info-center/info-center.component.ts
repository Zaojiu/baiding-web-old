import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {LiveStatus} from '../shared/api/live/live.enums';
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {UserInfoModel, UserPublicInfoModel} from "../shared/api/user-info/user-info.model";
import {UtilsService} from "../shared/utils/utils";
import {InvitationModel} from "../shared/api/invite/invite.model";
import {InviteApiService} from "../shared/api/invite/invite.api";
import {DomSanitizer, SafeUrl, SafeStyle} from "@angular/platform-browser";
import {ShareBridge} from "../shared/bridge/share.interface";
import {DurationFormaterPipe} from "../shared/pipe/time.pipe";
import {ScrollerDirective} from "../shared/scroller/scroller.directive";

@Component({
  templateUrl: './info-center.component.html',
  styleUrls: ['./info-center.component.scss'],
})

export class InfoCenterComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private route: ActivatedRoute,
              private liveService: LiveService, private userInfoService: UserInfoService,
              private shareService: ShareBridge, private inviteApiService: InviteApiService,
              private sanitizer: DomSanitizer, private durationPipe: DurationFormaterPipe) {
  }
  timeNow = UtilsService.now.toString();
  timer: any;
  pageUserInfo: UserPublicInfoModel;
  currentUserInfo: UserInfoModel;
  livesList: LiveInfoModel[] = [];
  livesListWatched: LiveInfoModel[] = [];
  uid: number;
  from: string;
  invitees: {[liveId: string]: InvitationModel[]} = {};
  covers: {[liveId: string]: SafeUrl} = {};
  liveTime: {[liveId: string]: string} = {};
  avatarBackground: SafeStyle;
  tabIndex = 0;
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  isLoading = true;

  ngOnInit() {
    this.currentUserInfo = this.route.snapshot.data['userInfo'];
    // 防止分享出去的链接不正确, 再做一次跳转到带uid的地址。
    if (!this.route.snapshot.params['uid']) {
      this.router.navigate([`/info-center/${this.currentUserInfo.uid}`]);
      return;
    }

    this.uid = +this.route.snapshot.params['uid'];
    this.from = encodeURIComponent(`/info-center/${this.uid}`);
    this.listMyLive();

    if (this.isSelf) this.listMyWatchLive();

    this.userInfoService.getUserPublicInfo(this.uid).then((pageUserInfo) => {
      this.pageUserInfo = pageUserInfo;
      this.avatarBackground = this.sanitizer.bypassSecurityTrustStyle(`url(${pageUserInfo.avatar})`);
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

  listMyLive() {
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

        if (liveInfo.status === LiveStatus.Created){
          if (moment(liveInfo.expectStartAt).isBefore(moment().add(3, 'd')) && moment(liveInfo.expectStartAt).isAfter(moment())) {
            let leftDays = moment.duration(moment(liveInfo.expectStartAt).diff(moment())).days();
            let dayStr = '';

            switch (leftDays) {
              case 0:
                dayStr = '今天';
                break;
              case 1:
                dayStr = '明天';
                break;
              case 2:
                dayStr = '后天';
                break;
            }

            this.liveTime[liveInfo.id] = `开始时间 ${dayStr} ${moment(liveInfo.expectStartAt).format('HH:mm:ss')}`;
          } else {
            this.liveTime[liveInfo.id] = `开始时间 ${moment(liveInfo.expectStartAt).format('YYYY-MM-DD HH:mm:ss')}`;
          }
        } else if (liveInfo.status === LiveStatus.Ended) {
          let diffSec = moment(liveInfo.closedAt).diff(moment(liveInfo.expectStartAt)) / 1000;
          let dayStr = this.durationPipe.transform(diffSec, 1);
          if (dayStr !== '') dayStr += ':';
          this.liveTime[liveInfo.id] = `直播时长 ${dayStr}${this.durationPipe.transform(diffSec, 2)}:${this.durationPipe.transform(diffSec, 3)}:${this.durationPipe.transform(diffSec, 4)}`;
        } else {
          this.liveTime[liveInfo.id] = '未知状态';
        }

        let coverUrl = liveInfo.coverSmallUrl ? liveInfo.coverSmallUrl : '/assets/img/default-cover.jpg';
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(coverUrl);
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  listMyWatchLive() {
    this.liveService.listBookedLiveInfo().then(liveListWatched => {
      this.livesListWatched = liveListWatched;

      for (let liveInfo of this.livesListWatched) {
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

        if (liveInfo.status === LiveStatus.Created){
          if (moment(liveInfo.expectStartAt).isBefore(moment().add(3, 'd')) && moment(liveInfo.expectStartAt).isAfter(moment())) {
            let leftDays = moment.duration(moment(liveInfo.expectStartAt).diff(moment())).days();
            let dayStr = '';

            switch (leftDays) {
              case 0:
                dayStr = '今天';
                break;
              case 1:
                dayStr = '明天';
                break;
              case 2:
                dayStr = '后天';
                break;
            }

            this.liveTime[liveInfo.id] = `开始时间 ${dayStr} ${moment(liveInfo.expectStartAt).format('HH:mm:ss')}`;
          } else {
            this.liveTime[liveInfo.id] = `开始时间 ${moment(liveInfo.expectStartAt).format('YYYY-MM-DD HH:mm:ss')}`;
          }
        } else if (liveInfo.status === LiveStatus.Ended) {
          let diffSec = moment(liveInfo.closedAt).diff(moment(liveInfo.expectStartAt)) / 1000;
          let dayStr = this.durationPipe.transform(diffSec, 1);
          if (dayStr !== '') dayStr += ':';
          this.liveTime[liveInfo.id] = `直播时长 ${dayStr}${this.durationPipe.transform(diffSec, 2)}:${this.durationPipe.transform(diffSec, 3)}:${this.durationPipe.transform(diffSec, 4)}`;
        } else {
          this.liveTime[liveInfo.id] = '未知状态';
        }

        let coverUrl = liveInfo.coverSmallUrl ? liveInfo.coverSmallUrl : '/assets/img/default-cover.jpg';
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(coverUrl);
      }
    });
  }

  get isSelf(): boolean {
    return this.currentUserInfo.uid === this.uid;
  }

  goToEdit() {
    this.router.navigate([`/info-center/edit-info`]);
  }

  popupShare() {
    this.shareService.share();
  }

  goInvitation(liveId: string) {
    this.router.navigate([`/lives/${liveId}/vip-info`, {from: this.from}]);
  }

  goEditLiveRoom(liveId: string) {
    this.router.navigate([`/lives/${liveId}/settings/edit-info`, {from: this.from}]);
  }

  gotoInfoCenter(uid: number) {
    if (this.pageUserInfo.uid === uid) return;

    this.router.navigate([`/info-center/${uid}`]);
  }

  gotoInvitation(liveId: string, invitee: InvitationModel) {
    if (invitee.token) this.router.navigate(([`/lives/${liveId}/invitation`, {token: invitee.token}]));
  }

  gotoLiveRoom(liveId: string) {
    if (this.pageUserInfo.uid === this.currentUserInfo.uid) {
      this.router.navigate(([`/lives/${liveId}`]));
    } else {
      this.router.navigate(([`/lives/${liveId}/info`]));
    }
  }

  switchIndex(index: number) {
    this.tabIndex = index;
  }
}
