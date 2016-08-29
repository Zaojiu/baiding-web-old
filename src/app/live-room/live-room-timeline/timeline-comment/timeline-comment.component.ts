import { Component, Input } from '@angular/core';
import { TimelineCommentModel } from './timeline-comment.model';
import { UserInfoModel } from '../../../shared/user-info/user-info.model';

@Component({
  selector: 'timeline-comment',
  templateUrl: './timeline-comment.component.html',
  styleUrls: ['./timeline-comment.component.scss'],
})

export class TimelineCommentComponent {
  @Input() comment: TimelineCommentModel;
  @Input() userInfo: UserInfoModel;

  constructor() {}
}
