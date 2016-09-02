
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config'
import { TimelineCommentType } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.enum';
import { TimelineCommentModel } from '../../live-room/live-room-timeline/timeline-comment/timeline-comment.model';

declare var $:any;

@Injectable()
export class GetCommentService {
  constructor (private http: Http, private config: AppConfig) {}

  parseComment(data: any, users: any[]): TimelineCommentModel {
    let comment = new TimelineCommentModel();
    comment.id = data.id;
    comment.isReceived = true;
    comment.user = users[data.uid];
    comment.content = data.content;
    if (data.type === 'text') comment.type = TimelineCommentType.Text;
    if (data.type === 'image') comment.type = TimelineCommentType.Image;
    if (data.type === 'audio') comment.type = TimelineCommentType.Audio;
    if (data.type === 'nice') comment.type = TimelineCommentType.Nice;
    comment.hadPraised = data.myPraisedId !== '';
    comment.praisedAmount = data.praised;
    comment.praisedAnimations = [];
    for (let uid of data.latestPraisedUids) {
      let user = users[uid];
      comment.praisedAvatars = comment.praisedAvatars || [];
      comment.praisedAvatars.push(user);
    }
    comment.reply = [];
    comment.createdAt = data.createdAt;

    return comment;
  }

  listComments(liveId: string, marker = '', limit = 20, sorts = ['-createdAt']): Promise<TimelineCommentModel[]> {
    var query = {
      createdAt: marker,
      limit: limit,
      sorts: sorts.join(',')
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
}
