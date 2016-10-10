import {Component, OnInit, OnDestroy}      from '@angular/core';
import {ActivatedRoute, Router, NavigationStart} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';

import {LiveService} from '../shared/live/live.service';
import {LiveInfoModel} from '../shared/live/live.model';
import {TitleService} from '../shared/title/title.service';
import {WechatService} from '../shared/wechat/wechat.service';
import {UserInfoService} from '../shared/user-info/user-info.service';
import {UserInfoModel} from '../shared/user-info/user-info.model';

@Component({
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.scss'],
})

export class LiveRoomComponent implements OnInit, OnDestroy {
  id: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  showInfo: boolean;
  isChildrenActived: boolean;
  routerSubscription: Subscription;
  isCommentOpened: boolean = true;
  urlRegex = new RegExp('^\/lives\/.*?\/(push-comment|post|history|invitation)$');

  constructor(private route: ActivatedRoute, private router: Router, private liveService: LiveService,
              private titleService: TitleService, private wechatService: WechatService, private userInfoService: UserInfoService) {
  }

  isEditor() {
    return this.liveService.isEditor(this.id);
  }

  isAudience() {
    return this.liveService.isAudience(this.id);
  }

  getShareUri(): string {
    let uriTree = this.router.parseUrl(location.hash.replace('#', ''))
    let search = uriTree.queryParams;
    if (!search['source']) search['source'] = 'share';
    let hash = this.router.serializeUrl(uriTree);
    let uri = location.href.replace(location.hash, `#${hash}`);
    return uri;
  }

  getLiveInfo() {
    this.id = this.route.snapshot.params['id'];

    this.liveService.getLiveInfo(this.id).then(liveInfo => {
      this.liveInfo = liveInfo;
      this.titleService.set(this.liveInfo.subject);
      this.wechatService.share(this.liveInfo.subject, this.liveInfo.desc, this.liveInfo.coverUrl, this.getShareUri(), this.id);
    });

    this.userInfo = this.userInfoService.getUserInfoCache();
    // TODO: 找不到直播间直接跳转404
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    let fromShare = !!this.route.snapshot.queryParams['source'];
    this.showInfo = fromShare;
    // 监控router变化，如果route换了，那么设置 isChildrenActived
    // 此属性会控制父底栏是否显示，以免子弹出层的底栏和父窗口底栏同时显示，导致跑版
    this.isChildrenActived = this.urlRegex.test(this.router.url);
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
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
