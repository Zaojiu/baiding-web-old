import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {LiveService} from "../../shared/api/live/live.service";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {ScrollerPosition} from "../../shared/scroller/scroller.enums";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {LiveStatus} from "../../shared/api/live/live.enums";
import {DurationFormaterPipe} from "../../shared/pipe/time.pipe";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {appConfig} from "../../../environments/environment";

declare var $: any;
declare var Waypoint: any;

@Component({
  templateUrl: './now.component.html',
  styleUrls: ['./now.component.scss'],
})

export class NowComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private route: ActivatedRoute, private liveService: LiveService,
              private sanitizer: DomSanitizer, private durationPipe: DurationFormaterPipe) {
  }

  private waypoints: any[] = [];
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
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.route.snapshot.data['shareTitle'] = `${this.userInfo ? this.userInfo.nick : '我'}正在使用${appConfig.name}，发现更多经验分享`;

    this.timer = setInterval(() => this.timeNow = UtilsService.now.toString(), 1000);

    this.getLists('', 20);
  }

  ngOnDestroy() {
    for (let waypoint of this.waypoints) {
      waypoint.destroy();
    }

    clearInterval(this.timer);
  }

  initWaypoint() {
    let $container = $('.live-list');
    let waypoints = this.waypoints;

    $('.live-info-block').each(function () {
      let $this = $(this);

      if ($this.hasClass('has-waypoint')) return;

      $this.addClass('has-waypoint');

      waypoints.push(
        new Waypoint.Inview({
          element: $this[0],
          context: $container[0],
          enter: (direction) => {
            if (direction === 'up') $this.addClass('entered');
          },
          entered: (direction) => {
            if (direction === 'up') $this.removeClass('entered');
          },
          exit: (direction) => {
            if (direction === 'down') $this.addClass('entered');
          },
          exited: (direction) => {
            if (direction === 'down') $this.removeClass('entered');
          }
        })
      );
    });
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
      }

      let isOnPcWithoutSticky = CSS && CSS.supports && !CSS.supports('position', 'sticky') && UtilsService.isOnLargeScreen;

      if (UtilsService.isiOS || isOnPcWithoutSticky) {
        setTimeout(() => {
          System.import('waypoints/lib/noframework.waypoints.js').then(() => {
            return System.import('waypoints/lib/shortcuts/inview.min.js');
          }).then(() => {
            this.initWaypoint();
          });
        }, 10);
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
