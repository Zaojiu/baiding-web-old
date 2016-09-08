import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SharePopupService } from './share-popup.service';

@Component({
  selector: 'share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss']
})

export class SharePopupComponent implements OnInit {
  isPopup: boolean;

  constructor(private sharePopupService: SharePopupService) {}

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。
    this.sharePopupService.popup$.subscribe(() => this.isPopup = true)
  }
}
