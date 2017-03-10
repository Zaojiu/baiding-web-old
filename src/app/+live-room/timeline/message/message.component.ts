import {Component, Input} from '@angular/core';

import {MessageModel} from '../../../shared/api/message/message.model';
import {UserInfoModel} from '../../../shared/api/user-info/user-info.model';
import {LiveInfoModel} from '../../../shared/api/live/live.model';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})

export class MessageComponent {
  @Input() liveId: string;
  @Input() message: MessageModel;
  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;
}
