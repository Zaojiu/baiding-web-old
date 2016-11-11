import {Component, OnInit} from '@angular/core';

import {TextPopupService} from './text-popup.service';

@Component({
  selector: 'text-popup',
  templateUrl: './text-popup.component.html',
  styleUrls: ['./text-popup.component.scss']
})

export class TextPopupComponent implements OnInit {
  isPopup: boolean;
  text: string;

  constructor(private textPopupService: TextPopupService) {
  }

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。
    this.textPopupService.popup$.subscribe((text) => {
      this.isPopup = true;
      this.text = text;
    });
  }

  close() {
    this.isPopup = false;
    this.text = '';
  }
}
