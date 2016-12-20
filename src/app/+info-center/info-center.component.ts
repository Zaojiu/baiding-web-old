import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {LiveStatus} from '../shared/api/live/live.enums';
import {UserInfoModel, UserPublicInfoModel} from "../shared/api/user-info/user-info.model";
import {UtilsService} from "../shared/utils/utils";
import {DomSanitizer, SafeUrl, SafeStyle} from "@angular/platform-browser";
import {ShareBridge} from "../shared/bridge/share.interface";
import {DurationFormaterPipe} from "../shared/pipe/time.pipe";
import {ScrollerDirective} from "../shared/scroller/scroller.directive";
import {Subscription} from "rxjs";
import {UserInfoService} from "../shared/api/user-info/user-info.service";

@Component({
  templateUrl: './info-center.component.html',
  styleUrls: ['./info-center.component.scss'],
})

export class InfoCenterComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private route: ActivatedRoute,
              private liveService: LiveService, private shareService: ShareBridge,
              private sanitizer: DomSanitizer, private durationPipe: DurationFormaterPipe,
              private userInfoService: UserInfoService) {
  }

  timeNow = UtilsService.now.toString();
  timer: any;
  pageUserInfo: UserPublicInfoModel;
  currentUserInfo: UserInfoModel;
  livesList: LiveInfoModel[] = [];
  livesListWatched: LiveInfoModel[] = [];
  from: string;
  covers: {[liveId: string]: SafeUrl} = {};
  liveTime: {[liveId: string]: string} = {};
  avatarBackground: SafeStyle;
  tabIndex = 0;
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  isLoading = true;
  isInApp = UtilsService.isInApp;
  uid: number;
  uidParamSub: Subscription;

  ngOnInit() {
    this.currentUserInfo = this.route.snapshot.data['userInfo'];

    this.uidParamSub = this.route.params.subscribe((params) => {
      this.uid = +params['uid'];
      if (!this.uid) this.router.navigate([`/404`]);
      this.initData(this.uid);
    });

    this.timer = setInterval(() => {
      this.timeNow = UtilsService.now.toString();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.uidParamSub) this.uidParamSub.unsubscribe();
  }

  initData(uid: number) {
    this.isLoading = true;

    Promise.all([this.getPageUserInfo(uid), this.listMyLive(this.uid)]).finally(() => {
      this.isLoading = false;
    });

    if (this.isSelf) this.listMyWatchLive();
  }

  getPageUserInfo(uid: number): Promise<void> {
    return this.userInfoService.getUserPublicInfo(uid).then(publicUserInfo => {
      this.pageUserInfo = publicUserInfo;
      this.avatarBackground = this.sanitizer.bypassSecurityTrustStyle(`url(${publicUserInfo.avatar})`);
      this.from = encodeURIComponent(`/info-center/${uid}`);
      return;
    }, () => {
      this.router.navigate([`/404`]);
      return;
    });
  }

  listMyLive(uid: number): Promise<void> {
    return this.liveService.listLiveInfo(uid, '', 1000, ['-createdAt']).then((livesList) => {
      this.livesList = livesList;

      for (let liveInfo of this.livesList) {

        if (liveInfo.status === LiveStatus.Created) {
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

      return;
    });
  }

  listMyWatchLive(): Promise<void> {
    return this.liveService.listBookedLiveInfo().then(liveListWatched => {
      this.livesListWatched = liveListWatched;

      for (let liveInfo of this.livesListWatched) {

        if (liveInfo.status === LiveStatus.Created) {
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

      return;
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

  gotoVipInfo(liveId: string) {
    this.router.navigate([`/lives/${liveId}/vip-info`, {from: this.from}]);
  }

  goEditLiveRoom(liveId: string) {
    this.router.navigate([`/lives/${liveId}/settings/edit-info`, {from: this.from}]);
  }

  gotoInfoCenter(uid: number) {
    if (this.pageUserInfo.uid === uid) return;

    this.router.navigate([`/info-center/${uid}`]);
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
