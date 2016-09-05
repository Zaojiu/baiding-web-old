import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { AppConfig } from '../../app.config'
import { PostCommentModel, PostCommentAudioModel } from './post-comment.model';
import { UserInfoService } from '../user-info/user-info.service';
import { LiveRoomTimelineService } from '../../live-room/live-room-timeline/live-room-timeline.service';
import { TimelineCommentType } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.enum';
import { TimelineCommentModel, TimelineCommentAudioModel } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.model';

@Injectable()
export class PostCommentService {
  constructor (private http: Http, private config: AppConfig, private userInfoService: UserInfoService, private timelineService: LiveRoomTimelineService) {}

  parseResponseComment(data: any, type: TimelineCommentType): TimelineCommentModel {
    let userInfo = this.userInfoService.getUserInfoCache();

    var timelineComment = new TimelineCommentModel();
    timelineComment.id = data.id;
    timelineComment.isReceived = false;
    timelineComment.user = userInfo;
    timelineComment.content = data.content;
    timelineComment.type = type;
    timelineComment.createdAt = +moment() * 1e6 + '';

    return timelineComment;
  }

  postTextComment(liveId, content): Promise<TimelineCommentModel> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages`;
    let comment = new PostCommentModel();
    comment.type = 'text';
    comment.content = content;

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();
        let timelineComment = this.parseResponseComment(data, TimelineCommentType.Text);

        this.timelineService.pushComment(timelineComment);

        return timelineComment;
      })
      .catch(res => {
          // TODO: error;
      });
  }

  postAudioComment(liveId: string, localId: string, serverId: string, translateResult: string, link = ''): Promise<TimelineCommentModel> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages`;
    let comment = new PostCommentModel()
    comment.type = 'audio'
    comment.audio = new PostCommentAudioModel()
    comment.audio.text = translateResult
    comment.audio.weixinId = serverId
    comment.audio.link = link

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();
        let timelineComment = this.parseResponseComment(data, TimelineCommentType.Audio);

        console.log(timelineComment, '1')

        timelineComment.audio = new TimelineCommentAudioModel()
        timelineComment.audio.localId = localId
        timelineComment.audio.translateResult = translateResult

        this.timelineService.pushComment(timelineComment);

        return timelineComment;
      })
      .catch(res => {
          // TODO: error;
      });
  }
}
