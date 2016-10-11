import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LiveInfoModel} from '../../shared/live/live.model';
import {LocalStorage} from "angular2-localstorage/WebStorage";

@Component({
  selector: 'live-room-info',
  templateUrl: './live-room-info.component.html',
  styleUrls: ['./live-room-info.component.scss'],
})

export class LiveRoomInfoComponent {
  @Input() liveInfo: LiveInfoModel;
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();
  @Output() showBeginnerGuide = new EventEmitter<boolean>();
  @LocalStorage() public beginnerGuideShowed: Object = {};
  guideShowed: boolean;

  constructor() {
  }

  close() {
    this.isShowChange.emit(false);
  }

  setGuideAlreadyShown() {
    this.beginnerGuideShowed['guideAlreadyShown'] = true
  }

  toBeginnerGuide() {
    this.guideShowed = this.beginnerGuideShowed['guideAlreadyShown'];

    if (!this.guideShowed) {
      this.setGuideAlreadyShown();
      this.showBeginnerGuide.emit(true);
    }
    this.close();
  }
}
