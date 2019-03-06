import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'topbar-switch-btn',
  templateUrl: './topbar-switch-btn.component.html',
  styleUrls: ['./topbar-switch-btn.component.scss'],
})

export class TopBarSwitchBtnComponent implements OnInit {
  @Input() isCommentOpened: boolean;
  @Input() onlineCount: number;
  @Input() isOpened: boolean;
  @Input() btnText: string;
  @Input() openId: string;
  @Input() isShow: boolean;
  @Output() toggling = new EventEmitter<boolean>();
  _btnText: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this._btnText = this.sanitizer.bypassSecurityTrustHtml(this.btnText);
    if ( this.openId === '5c2dc1b2bdd5270001a91b54') {// 5c2dc1b2bdd5270001a91b54单独隐藏
      this.isShow = true;
      this.isOpened = false;
      this.toggling.emit(this.isOpened);
    }
  }

  emitToggleEvent() {
    if (this.openId !== '5c2dc1b2bdd5270001a91b54') {
      this.isOpened = !this.isOpened;
    this.toggling.emit(this.isOpened);
    }
  }
}
