import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {BottomPopupSelectorService} from './bottom-popup-selector.service';
import {
  BottomPopupSelectorItemModel, BottomPopupSelectorMode,
  BottomPopupSelectorModel
} from "./bottom-popup-selector.model";

@Component({
  selector: 'bottom-popup-selector',
  templateUrl: './bottom-popup-selector.component.html',
  styleUrls: ['./bottom-popup-selector.component.scss']
})

export class BottomPopupSelectorComponent implements OnInit {
  isPopup: boolean;
  routerSubscription: Subscription;
  modeEnums = BottomPopupSelectorMode;
  model: BottomPopupSelectorModel;


  constructor(private router: Router, private bottomPopupService: BottomPopupSelectorService) {
  }

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。

    this.bottomPopupService.needPopup$.subscribe(
      model => {
        if (this.isPopup) return;

        this.isPopup = true;
        this.model = model;
      }
    );

    this.bottomPopupService.needClose$.subscribe(
      () => {
        if (!this.isPopup) return;

        this.isPopup = false;
      }
    );

    // 监控router变化，如果route换了，那么关闭全局弹出层
    if (this.model && this.model.needSubscribe) {
      this.routerSubscription = this.router.events.subscribe(
        event => {
          if (event instanceof NavigationStart) {
            if (!this.bottomPopupService.isClosed) this.bottomPopupService.close();
          }
        }
      );
    }
  }

  selectItem(item: BottomPopupSelectorItemModel, evt: Event) {
    if (item.mode === BottomPopupSelectorMode.Multi) {
      item.checked = !item.checked;
      evt.stopPropagation();
    }

    this.bottomPopupService.selectItem(item);
  }

  close() {
    this.bottomPopupService.close();
  }
}
