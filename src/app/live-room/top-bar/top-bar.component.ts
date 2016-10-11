import {Component, Input, Output, EventEmitter}      from '@angular/core';
import {SharePopupService} from "../../shared/share-popup/share-popup.service";

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})

export class TopBarComponent {
  @Input() isCommentOpened: boolean;
  @Output() isCommentOpenedChange = new EventEmitter<boolean>();

  constructor(private sharePopupService: SharePopupService) {
  }

  toggleComment(isOpened: boolean) {
    this.isCommentOpenedChange.emit(isOpened);
  }

  popupShare() {
    this.sharePopupService.popup();
  }
}
