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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      const urlRegex = new RegExp('^\/lives\/.*?\/(push-comment|post-comment)$');
      if(event instanceof NavigationStart) {
        this.isChildrenActived = urlRegex.test(event.url);
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
