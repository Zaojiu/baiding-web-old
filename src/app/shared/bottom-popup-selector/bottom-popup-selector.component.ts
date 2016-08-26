import { Component, OnInit } from '@angular/core';
import { BottomPopupSelectorService } from './bottom-popup-selector.service'

@Component({
  selector: 'bottom-popup-selector',
  templateUrl: './bottom-popup-selector.component.html',
  styleUrls: ['./bottom-popup-selector.component.scss']
})

export class BottomPopupSelectorComponent implements OnInit {
  items: string[];
  hasBottomBar: boolean;
  isPopup: boolean;

  constructor(private bottomPopupService: BottomPopupSelectorService) {}

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
      _ => {
        if (!this.isPopup) { return }

        this.isPopup = false;
        this.items = [];
        this.hasBottomBar = false;
      }
    );
  }

  selectItem(index) {
    this.bottomPopupService.selectItem(index);
  }

  close() {
    this.bottomPopupService.close();
  }
}
