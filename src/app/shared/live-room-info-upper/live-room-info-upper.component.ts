import {Component, Input} from '@angular/core';
import {LiveInfoModel} from '../api/live/live.model';

@Component({
  selector: 'live-room-info-upper',
  templateUrl: './live-room-info-upper.component.html',
  styleUrls: ['./live-room-info-upper.component.scss'],
})

export class LiveRoomInfoUpperComponent {
  @Input() liveInfo: LiveInfoModel;

  constructor() {
  }
}
