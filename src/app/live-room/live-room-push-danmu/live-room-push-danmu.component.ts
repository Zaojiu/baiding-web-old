import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import { PostDanmuService } from '../../shared/comment/post-danmu.service'
import { LiveRoomPushDanmuService } from './live-room-push-danmu.service'
import { LiveRoomDanmuModel } from '../live-room-danmu/live-room-danmu.model'
import { UserInfoService } from '../../shared/user-info/user-info.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';

@Component({
  templateUrl: './live-room-push-danmu.component.html',
  styleUrls: ['./live-room-push-danmu.component.scss'],
  providers: [ PostDanmuService, LiveRoomPushDanmuService ]
})

export class LiveRoomPushDanmuComponent implements OnInit, OnDestroy {
  liveId: string;
  danmus: LiveRoomDanmuModel[] = [];
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  scrollSubscription: Subscription;
  isOnLatest: boolean;
  isOnNewest: boolean;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private postDanmuService: PostDanmuService,
    private liveRoomPushDanmuService: LiveRoomPushDanmuService, private userInfoService: UserInfoService,
    private liveService: LiveService) {}

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    let userInfoPromise = this.userInfoService.getUserInfo();
    let liveInfoPromise = this.liveService.getLiveInfo(this.liveId);

    Promise.all([userInfoPromise, liveInfoPromise]).then(result => {
      let userInfo = result[0]
      let liveInfo = result[1]

      this.userInfo = userInfo
      this.liveInfo = liveInfo
      this.gotoFirstDanmus()
      this.startObserveTimelineScroll()
    });
  }

  ngOnDestroy() {
    this.stopObserveTimelineScroll()
  }

  gotoFirstDanmus() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.postDanmuService.listDanmus(this.liveId, '', 20, ['createdAt']).then(danmus => {
      this.danmus = danmus;
      this.isOnNewest = true;
      this.isOnLatest = false;
      this.isLoading = false;
    });
  }

  getNextDanmus(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.postDanmuService.listDanmus(this.liveId, marker, limit, sorts).then(danmus => {
      for (let danmu of danmus) {
        this.danmus.push(danmu);
      }

      if (danmus.length === 0) {
        this.isOnLatest = true;
      }

      this.isLoading = false;
    });
  }

  getPrevDanmus(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.postDanmuService.listDanmus(this.liveId, marker, limit, sorts).then(danmus => {
      for (let danmu of danmus) {
        this.danmus.unshift(danmu);
      }

      if (danmus.length === 0) {
        this.isOnNewest = true;
      }

      this.isLoading = false;
    });
  }

  startObserveTimelineScroll() {
    this.scrollSubscription = this.liveRoomPushDanmuService.scroller$.subscribe(
      topOrBottom => {
        if (topOrBottom) {
          if (this.danmus.length === 0) return;
          let firstDanmu = this.danmus[0];
          this.getPrevDanmus(`$lt${firstDanmu.createdAt}`, 20, ['-createdAt']);
        } else {
          if (this.danmus.length === 0) return;
          let lastDanmu = this.danmus[this.danmus.length-1];
          this.getNextDanmus(`$gt${lastDanmu.createdAt}`, 20, ['createdAt']);
        }
      }
    );
  }

  stopObserveTimelineScroll() {
    this.scrollSubscription.unsubscribe();
  }

  pushDanmu(danmu: LiveRoomDanmuModel) {
    this.router.navigate([`/lives/${this.liveId}/post-comment`, {'danmu_id': danmu.id}]);
  }
}
