import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {UserInfoModel, UserPublicInfoModel} from "../shared/api/user-info/user-info.model";
import {UtilsService} from "../shared/utils/utils";
import {DomSanitizer, SafeUrl, SafeStyle} from "@angular/platform-browser";
import {ShareBridge} from "../shared/bridge/share.interface";
import {TimeToFormatedPipe} from "../shared/pipe/time.pipe";
import {ScrollerDirective} from "../shared/scroller/scroller.directive";
import {Subscription} from "rxjs";
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {TitleService} from "../shared/title/title.service";
import {environment} from "../../environments/environment";

@Component({
  templateUrl: './info-center.component.html',
  styleUrls: ['./info-center.component.scss'],
})

export class InfoCenterComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private route: ActivatedRoute,
              private liveService: LiveService, private shareService: ShareBridge,
              private sanitizer: DomSanitizer, private userInfoService: UserInfoService,
              private timeToformatedPipe: TimeToFormatedPipe, private titleService: TitleService) {
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
      if (!this.uid) {
        this.router.navigate([`/404`]);
        return;
      }
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

  getShareUri(): string {
    let uriTree = this.router.createUrlTree([`info-center/${this.pageUserInfo.uid}`]);
    let path = this.router.serializeUrl(uriTree);
    return `${location.protocol}//${location.hostname}${path}`;
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
      this.from = encodeURIComponent(`info-center/${uid}`);
      this.shareService.setShareInfo(
        `${this.pageUserInfo.nick}等你加入我的话题讨论`,
        environment.config.slogan,
        this.pageUserInfo.avatar,
        this.getShareUri()
      );
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

        if (liveInfo.latestUsers.length > 5) {
          liveInfo.latestUsers = liveInfo.latestUsers.slice(0, 5);
        }

        if (liveInfo.isCreated()) {
          let dayStr = moment(liveInfo.expectStartAt).calendar(null, {
            sameDay: '[今天] HH:mm:ss',
            nextDay: '[明天] HH:mm:ss',
            nextWeek: 'YYYY-MM-DD HH:mm:ss',
            lastDay: 'YYYY-MM-DD HH:mm:ss',
            lastWeek: 'YYYY-MM-DD HH:mm:ss',
            sameElse: 'YYYY-MM-DD HH:mm:ss'
          });

          this.liveTime[liveInfo.id] = `开始时间 ${dayStr}`;
        } else if (liveInfo.isClosed()) {
          this.liveTime[liveInfo.id] = `直播时长 ${this.timeToformatedPipe.transform(liveInfo.expectStartAt, liveInfo.closedAt)}`;
        } else if (liveInfo.isStarted()) {
        } else {
          this.liveTime[liveInfo.id] = '未知状态';
        }

        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(liveInfo.coverSmallUrl);
      }

      return;
    });
  }

  listMyWatchLive(): Promise<void> {
    return this.liveService.listBookedLiveInfo().then(liveListWatched => {
      this.livesListWatched = liveListWatched;

      for (let liveInfo of this.livesListWatched) {

        if (liveInfo.latestUsers.length > 5) {
          liveInfo.latestUsers = liveInfo.latestUsers.slice(0, 5);
        }

        if (liveInfo.isCreated()) {
          let dayStr = moment(liveInfo.expectStartAt).calendar(null, {
            sameDay: '[今天] HH:mm:ss',
            nextDay: '[明天] HH:mm:ss',
            nextWeek: 'YYYY-MM-DD HH:mm:ss',
            lastDay: 'YYYY-MM-DD HH:mm:ss',
            lastWeek: 'YYYY-MM-DD HH:mm:ss',
            sameElse: 'YYYY-MM-DD HH:mm:ss'
          });

          this.liveTime[liveInfo.id] = `开始时间 ${dayStr}`;
        } else if (liveInfo.isClosed()) {
          this.liveTime[liveInfo.id] = `直播时长 ${this.timeToformatedPipe.transform(liveInfo.expectStartAt, liveInfo.closedAt)}`;
        } else if (liveInfo.isStarted()) {
        } else {
          this.liveTime[liveInfo.id] = '未知状态';
        }

        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(liveInfo.coverSmallUrl);
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
