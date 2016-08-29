import { Component, OnInit, OnDestroy }              from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import { BottomPopupSelectorService } from '../../shared/bottom-popup-selector/bottom-popup-selector.service';
import { BottomPopupSelectorModel } from '../../shared/bottom-popup-selector/bottom-popup-selector.model';

@Component({
  selector: 'live-room-editor-bottom-bar',
  templateUrl: './live-room-editor-bottom-bar.component.html',
  styleUrls: ['./live-room-editor-bottom-bar.component.scss']
})

export class LiveRoomEditorBottomBarComponent implements OnInit, OnDestroy {
  id: string;
  popupSelectorSubscription: Subscription;
  closeSelectorSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private bottomPopupService: BottomPopupSelectorService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    // 监控router变化，如果route换了，那么关闭全局弹出层
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if ( event instanceof NavigationStart ) {
          if (!this.bottomPopupService.isClosed) this.bottomPopupService.close();
        }
      }
    );
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    if (this.popupSelectorSubscription) { this.popupSelectorSubscription.unsubscribe(); }
    if (this.closeSelectorSubscription) { this.closeSelectorSubscription.unsubscribe(); }
  }

  gotoPushComment() {
    this.router.navigate(['/lives/' + this.id + '/push-comment']);
  }

  gotoPostComment() {
    this.router.navigate(['/lives/' + this.id + '/post-comment']);
  }

  popupBottomSelector() {
    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = ['邀请嘉宾', '结束直播'];
      model.hasBottomBar = true;
      this.bottomPopupService.popup(model)
      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        index => {
          console.log(index);
        }
      );
      this.closeSelectorSubscription = this.bottomPopupService.needClose$.subscribe(
        () => {
          this.popupSelectorSubscription.unsubscribe();
          this.closeSelectorSubscription.unsubscribe();
        }
      );
    } else {
      this.bottomPopupService.close();
    }
  }
}
