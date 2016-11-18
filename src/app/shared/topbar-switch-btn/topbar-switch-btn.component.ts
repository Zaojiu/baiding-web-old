import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'topbar-switch-btn',
  templateUrl: 'topbar-switch-btn.component.html',
  styleUrls: ['topbar-switch-btn.component.scss'],
})

export class TopBarSwitchBtnComponent implements OnInit {
  @Input() isOpened: boolean;
  @Input() btnText: string;
  @Output() toggling = new EventEmitter<boolean>();
  _btnText: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this._btnText = this.sanitizer.bypassSecurityTrustHtml(this.btnText);
  }

  emitToggleEvent() {
    this.isOpened = !this.isOpened;
    this.toggling.emit(this.isOpened);
  }
}
