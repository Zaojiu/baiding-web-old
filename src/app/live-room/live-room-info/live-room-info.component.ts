import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LiveInfoModel} from '../../shared/live/live.model';
import {LiveService} from '../../shared/live/live.service';

@Component({
  selector: 'live-room-info',
  templateUrl: './live-room-info.component.html',
  styleUrls: ['./live-room-info.component.scss'],
})

export class LiveRoomInfoComponent {
  @Input() liveInfo: LiveInfoModel;
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();

  constructor(private liveService: LiveService) {
  }

  close() {
    this.isShowChange.emit(false);
  }

  toBeginnerGuide() {
    this.close();
    this.liveService.LiveRoomAlreadyVisited();
  }
}
