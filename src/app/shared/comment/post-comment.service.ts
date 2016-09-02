import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { AppConfig } from '../../app.config'
import { PostCommentModel } from './post-comment.model';
import { UserInfoService } from '../user-info/user-info.service';
import { LiveRoomTimelineService } from '../../live-room/live-room-timeline/live-room-timeline.service';
import { TimelineCommentType } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.enum';
import { TimelineCommentModel } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.model';

@Injectable()
export class PostCommentService {
  constructor (private http: Http, private config: AppConfig, private userInfoService: UserInfoService, private timelineService: LiveRoomTimelineService) {}

  postTextComment(liveId, content) {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages`;
    let comment = new PostCommentModel();
    comment.type = 'text';
    comment.content = content;

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();

        return this.userInfoService.getUserInfo().then(userInfo => {
          var timelineComment = new TimelineCommentModel();
          timelineComment.id = data.id;
          timelineComment.isReceived = false;
          timelineComment.user = userInfo;
          timelineComment.content = content;
          timelineComment.type = TimelineCommentType.Text;
          timelineComment.createdAt = moment().format();

          this.timelineService.pushComment(timelineComment);

          return timelineComment;
        });
      })
      .catch(res => {
          // TODO: error;
      });
  }
}
