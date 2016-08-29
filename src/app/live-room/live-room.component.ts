import { Component, OnInit, OnDestroy }      from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.scss']
})

export class LiveRoomComponent implements OnInit, OnDestroy {
  id: string;
  isChildrenActived: boolean;
  routerSubscription: Subscription;
  isDanmuOpened: boolean = true;
  urlRegex = new RegExp('^\/lives\/.*?\/(push-comment|post-comment)$');

  constructor(private route: ActivatedRoute, private router: Router) {}

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
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
