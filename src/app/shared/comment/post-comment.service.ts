import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { AppConfig } from '../../app.config'
import { PostCommentModel, PostCommentAudioModel, PostCommentNiceModel } from './post-comment.model';
import { UserInfoService } from '../user-info/user-info.service';
import { LiveRoomTimelineService } from '../../live-room/live-room-timeline/live-room-timeline.service';
import { TimelineCommentType } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.enum';
import { TimelineCommentModel, TimelineCommentAudioModel, TimelineCommentReplyModel } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.model';

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

  postTextComment(liveId: string, content: string, replyParent?: string): Promise<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages`;
    let comment = new PostCommentModel();
    comment.type = 'text';
    comment.content = content;

    if (replyParent) {
      comment.parentId = replyParent
    }

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();

        if (replyParent != '') {
          for (let replyData of data.replyMessages) {
            let reply = new TimelineCommentReplyModel();
            let userInfo = this.userInfoService.getUserInfoCache();

            reply.id = replyData.id
            reply.parentId = replyParent
            reply.user = userInfo
            reply.content = replyData.content
            reply.createdAt = replyData.createdAt
            this.timelineService.pushReply(reply)

            return reply
          }
        } else {
          let timelineComment = this.parseResponseComment(data, TimelineCommentType.Text);
          this.timelineService.pushComment(timelineComment);

          return timelineComment;
        }
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

  postNiceComment(liveId: string, content: string, danmuId: string, uid: number, danmuContent: string): Promise<TimelineCommentModel> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages`;
    let comment = new PostCommentModel()
    comment.type = 'nice'
    comment.content = content
    comment.nice = new PostCommentNiceModel()
    comment.nice.commentId = danmuId
    comment.nice.uid = uid
    comment.nice.message = danmuContent

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();
        let timelineComment = this.parseResponseComment(data, TimelineCommentType.Nice);

        if (data.type === 'nice') {
          timelineComment.user = data.users[data.nice.uid]
          timelineComment.content = data.nice.message

          let reply = new TimelineCommentReplyModel();
          reply.id = data.id
          reply.user = data.users[data.uid]
          reply.content = data.content
          reply.createdAt = data.createdAt
          timelineComment.replies.push(reply)
        }

        this.timelineService.pushComment(timelineComment);

        return timelineComment;
      })
      .catch(res => {
          // TODO: error;
      });
  }
}
