import {Component, Input, Output, EventEmitter}      from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'switch-btn',
  templateUrl: './switch-btn.component.html',
  styleUrls: ['./switch-btn.component.scss'],
})

export class SwitchBtnComponent {
  @Input() isOpened: boolean;
  @Input() btnText: string;
  @Output() toggling = new EventEmitter<boolean>();

  constructor(private sanitizer: DomSanitizer) {
  }

  emitToggleEvent() {
    this.isOpened = !this.isOpened;
    this.toggling.emit(this.isOpened);
  }

  getTrustedContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
