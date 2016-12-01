import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {LiveService} from "../shared/api/live/live.service";
import {LiveInfoModel} from "../shared/api/live/live.model";
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {UtilsService} from "../shared/utils/utils";

declare var $: any;
declare var Waypoint: any;

@Component({
  templateUrl: './live-list.component.html',
  styleUrls: ['./live-list.component.scss'],
})

export class LiveListComponent implements OnInit, OnDestroy {
  constructor(private router: Router,
              private liveService: LiveService, private userInfoService: UserInfoService,
              private sanitizer: DomSanitizer) {
  }

  livesList: LiveInfoModel[];
  covers: {[liveId: string]: SafeUrl} = {};
  liveTime: {[liveId: string]: string} = {};
  waypoints: any[] = [];

  ngOnInit() {
    this.liveService.listLiveInfo(15421165063, '', 1000, ['-createdAt']).then((livesList) => {
      this.livesList = livesList;

      for (let liveInfo of this.livesList) {
        let coverUrl = liveInfo.coverSmallUrl ? liveInfo.coverSmallUrl : '/assets/img/liveroombanner-blur.jpg';
        this.covers[liveInfo.id] = this.sanitizer.bypassSecurityTrustUrl(coverUrl);

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

          this.liveTime[liveInfo.id] = `${dayStr} ${moment(liveInfo.expectStartAt).format('HH:mm:ss')}`;
        } else {
          this.liveTime[liveInfo.id] = moment(liveInfo.expectStartAt).format('YYYY-MM-DD HH:mm:ss');
        }
      }

      if (UtilsService.isIPhone || (CSS && CSS.supports && !CSS.supports('position', 'sticky') && !UtilsService.isInWechat && !UtilsService.isInApp)) {
        setTimeout(() => {
          System.import('waypoints/lib/noframework.waypoints.js').then(() => {
            return System.import('waypoints/lib/shortcuts/inview.min.js');
          }).then(() => {
            this.initWaypoint();
          });
        }, 10);
      }
    });
  }

  ngOnDestroy() {
    for (let waypoint of this.waypoints) {
      waypoint.destroy();
    }
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
            console.log(direction, '>>');
            if (direction === 'down') $this.addClass('entered');
          },
          exited: (direction) => {
            console.log(direction, '>>');
            if (direction === 'down') $this.removeClass('entered');
          }
        })
      );
    });
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

  gotoInfoCenter(uid: number) {
    this.router.navigate(([`/info-center/${uid}`]));
  }
}
