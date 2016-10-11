import {Component, Input, Output, EventEmitter}      from '@angular/core';

@Component({
  selector: 'switch-btn',
  templateUrl: './switch-btn.component.html',
  styleUrls: ['./switch-btn.component.scss'],
})

export class SwitchBtnComponent {
  @Input() isOpened: boolean;
  @Input() btnText: string;
  @Output() toggling = new EventEmitter<boolean>();

  constructor() {
  }

  emitToggleEvent() {
    this.isOpened = !this.isOpened;
    this.toggling.emit(this.isOpened);
  }
}
