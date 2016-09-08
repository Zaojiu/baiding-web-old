import { Component, OnInit, OnDestroy }      from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import { LiveService } from '../shared/live/live.service';
import { LiveInfoModel } from '../shared/live/live.model';
import { LiveRoomTimelineService } from './live-room-timeline/live-room-timeline.service';
import { LiveRoomCommentService } from './live-room-danmu/live-room-danmu.service';
import { TitleService } from '../shared/title/title.service';
import { WechatService } from '../shared/wechat/wechat.service';

@Component({
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.scss'],
  providers: [ LiveService, LiveRoomTimelineService, LiveRoomCommentService ]
})

export class LiveRoomComponent implements OnInit, OnDestroy {
  id: string;
  liveInfo: LiveInfoModel;
  isChildrenActived: boolean;
  routerSubscription: Subscription;
  isDanmuOpened: boolean = true;
  urlRegex = new RegExp('^\/lives\/.*?\/(push-danmu|post-comment|history|invitation)$');

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
    private titleService: TitleService, private wechatService: WechatService) {}

  isEditor() { return this.liveService.isEditor(this.id); }

  isAudience() { return this.liveService.isAudience(this.id); }

  getLiveInfo() {
    this.liveService.getLiveInfo(this.id).then(info => {
      this.liveInfo = info
      this.titleService.set(this.liveInfo.subject)
      this.wechatService.share(this.liveInfo.subject, this.liveInfo.desc, this.liveInfo.coverUrl, location.href, this.id)
    });

    // TODO: 直播间不存在，直接404
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    // 监控router变化，如果route换了，那么设置 isChildrenActived
    // 此属性会控制父底栏是否显示，以免子弹出层的底栏和父窗口底栏同时显示，导致跑版
    this.isChildrenActived = this.urlRegex.test(this.router.url);
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if ( event instanceof NavigationStart ) {
          this.isChildrenActived = this.urlRegex.test(event.url);
        }
      }
    );

    this.getLiveInfo();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
