import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges}      from '@angular/core';

declare var $: any;

@Component({
  selector: 'tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss'],
})

export class ToolTipsComponent implements OnChanges {
  @Input() isOpened: boolean;
  @Output() isOpenedChange = new EventEmitter<boolean>();
  @Input() items: string[];
  @Output() itemSelected = new EventEmitter<string>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    let isOpenedChange = changes['isOpened'];

    if (isOpenedChange && isOpenedChange.currentValue === true) {
      $('body').one('touchstart', () => {
        this.close();
      });
    }
  }

  selectItem(item: string) {
    this.itemSelected.emit(item);
  }

  close() {
    this.isOpened = false;
    this.isOpenedChange.emit(false);
  }
}
