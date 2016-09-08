
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config'
import { TimelineCommentType } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.enum';
import { TimelineCommentModel, TimelineCommentAudioModel, TimelineCommentReplyModel } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.model';

declare var $:any;

@Injectable()
export class GetCommentService {
  constructor (private http: Http, private config: AppConfig) {}

  parseComment(data: any, users: any[]): TimelineCommentModel {
    data.replyMessages = data.replyMessages || []

    let comment = new TimelineCommentModel();

    if (!data) return comment

    comment.id = data.id;
    comment.isReceived = true;
    comment.user = users[data.uid];
    comment.content = data.content;

    if (data.type === 'text') comment.type = TimelineCommentType.Text;
    if (data.type === 'image') comment.type = TimelineCommentType.Image;
    if (data.type === 'audio') {
      comment.type = TimelineCommentType.Audio
      comment.audio = new TimelineCommentAudioModel()
      comment.audio.localId = ''
      comment.audio.serverId = data.audio.weixinId
      comment.audio.translateResult = data.audio.text
    }
    if (data.type === 'nice') {
      comment.type = TimelineCommentType.Nice
      comment.user = users[data.nice.uid]
      comment.content = data.nice.message
    };

    comment.hadPraised = data.myPraisedId !== '';
    comment.praisedAmount = data.praised;
    comment.praisedAnimations = [];
    for (let uid of data.latestPraisedUids) {
      let user = users[uid];
      comment.praisedAvatars = comment.praisedAvatars || [];
      comment.praisedAvatars.push(user);
    }
    comment.replies = [];

    // 将推送消息的推送人和被推送人的内容交换
    if (data.type === 'nice') {
      let reply = new TimelineCommentReplyModel();
      reply.id = data.id
      reply.user = users[data.uid]
      reply.content = data.content
      reply.createdAt = data.createdAt
      comment.replies.push(reply)
    }

    // 包装回复消息
    for (let replyData of data.replyMessages) {
      let reply = new TimelineCommentReplyModel();
      reply.id = replyData.id
      reply.user = users[replyData.uid]
      reply.content = replyData.content
      reply.createdAt = replyData.createdAt
      comment.replies.push(reply)
    }

    comment.createdAt = data.createdAt;

    return comment;
  }

  listComments(liveId: string, marker = '', limit = 20, sorts = ['-createdAt'], parentId = 'null'): Promise<TimelineCommentModel[]> {
    var query = {
      createdAt: marker,
      limit: limit,
      sorts: sorts.join(','),
      parentId: parentId
    };
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages?${$.param(query)}`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json();
        let comments: TimelineCommentModel[] = [];

        if (data && data.result) {
          for (let commentData of data.result) {
            let comment = this.parseComment(commentData, data.include.users);
            comments.push(comment);
          }
        }

        return comments;
      }).catch(res => {
          // TODO: error;
      });
  }

  getComment(liveId: string, commentId: string): Promise<TimelineCommentModel> {
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages/${commentId}`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json()
        let comment = this.parseComment(data, data.users)

        return comment;
      }).catch(res => {
          // TODO: error;
      });
  }
}
