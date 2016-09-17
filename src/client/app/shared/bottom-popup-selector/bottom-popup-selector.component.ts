import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BottomPopupSelectorService } from './bottom-popup-selector.service';

@Component({
  moduleId: module.id,
  selector: 'bottom-popup-selector',
  templateUrl: './bottom-popup-selector.component.html',
  styleUrls: ['./bottom-popup-selector.component.css']
})

export class BottomPopupSelectorComponent implements OnInit {
  items: string[];
  hasBottomBar: boolean;
  isPopup: boolean;
  routerSubscription: Subscription;

  constructor(private router: Router, private bottomPopupService: BottomPopupSelectorService) {}

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。
    this.bottomPopupService.needPopup$.subscribe(
      model => {
        if (this.isPopup) { return }

        this.isPopup = true;
        this.items = model.items;
        this.hasBottomBar = model.hasBottomBar;
      }
    );

    this.bottomPopupService.needClose$.subscribe(
      () => {
        if (!this.isPopup) { return }

        this.isPopup = false;
        this.items = [];
        this.hasBottomBar = false;
      }
    );

    // 监控router变化，如果route换了，那么关闭全局弹出层
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if ( event instanceof NavigationStart ) {
          if (!this.bottomPopupService.isClosed) this.bottomPopupService.close();
        }
      }
    );
  }

  selectItem(item: string) {
    this.bottomPopupService.selectItem(item);
  }

  close() {
    this.bottomPopupService.close();
  }
}
