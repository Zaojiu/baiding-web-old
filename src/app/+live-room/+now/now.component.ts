import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {ScrollerPosition} from "../../shared/scroller/scroller.enums";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {appConfig} from "../../../environments/environment";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";

declare var $: any;

@Component({
  templateUrl: './now.component.html',
  styleUrls: ['./now.component.scss'],
})

export class NowComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private sanitizer: DomSanitizer, private userInfoService: UserInfoService) {
  }

  private loadSize = 20;
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  livesList: LiveInfoModel[] = [];
  covers: { [liveId: string]: SafeUrl } = {};
  liveTime: { [liveId: string]: string } = {};
  isOnLatest: boolean;
  timeNow = UtilsService.now.toString();
  timer: any;
  userInfo: UserInfoModel;
  from = '/';
  isInApp = UtilsService.isInApp;

  ngOnInit() {
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.route.snapshot.data['shareTitle'] = `${this.userInfo ? this.userInfo.nick : '我'}正在使用${appConfig.name}，发现更多经验分享`;

    this.timer = setInterval(() => this.timeNow = UtilsService.now.toString(), 1000);

    this.getLists('', 20);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  gotoLiveRoomInfo(liveId: string) {
    this.router.navigate([`/lives/${liveId}/info`]);
  }

  gotoInfoCenter(uid: number) {
    this.router.navigate(([`/info-center/${uid}`]));
  }

  getLists(markerId: string, size: number): Promise<LiveInfoModel[]> {
    return this.liveService.listNow(markerId, size + 1).then((livesList) => {
      if (livesList.length < size + 1) {
        this.isOnLatest = true;
      } else {
        livesList.pop();
      }

      this.scroller.appendData(livesList);

      for (let liveInfo of this.livesList) {
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(liveInfo.coverSmallUrl);
        this.liveTime[liveInfo.id] = UtilsService.praseLiveTime(liveInfo)
      }

      return livesList;
    });
  }

  onScroll(e: ScrollerEventModel) {
    if (e.position == ScrollerPosition.OnBottom) {
      if (this.livesList.length !== 0 && !this.isOnLatest) {
        let lastId = this.livesList[this.livesList.length - 1].id;
        this.getLists(lastId, this.loadSize).finally(() => {
          this.scroller.hideFootLoading();
        });
      }
    }
  }
}
