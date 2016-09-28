import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config';
import { PostCommentModel } from './comment.model';
import { UserInfoService } from '../user-info/user-info.service';
import { UserInfoModel } from '../user-info/user-info.model';
import { CommentService } from '../../live-room/comment/comment.service';
import { CommentModel } from '../../live-room/comment/comment.model';

declare var $:any;

@Injectable()
export class CommentApiService {
  constructor (private http: Http, private config: AppConfig,
    private userInfoService: UserInfoService, private commentService: CommentService) { }

  parseComment(data: any, users: any): CommentModel {
    var comment = new CommentModel()

    if (!data) return comment

    comment.id = data.id
    comment.user = users[data.uid] as UserInfoModel
    comment.msgId = data.msgId
    comment.content = data.content
    comment.createdAt = data.createdAt

    return comment
  }

  parseResponseComment(data: any): CommentModel {
    var comment = new CommentModel()
    let userInfo = this.userInfoService.getUserInfoCache();

    if (!data) return comment

    comment.id = data.id
    comment.user = userInfo
    comment.msgId = data.msgId
    comment.content = data.content
    comment.createdAt = data.createdAt

    return comment
  }

  postComment(liveId, content): Promise<CommentModel> {
    let headers = new Headers({'Content-Type': 'application/json'})
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments`
    let comment = new PostCommentModel()
    comment.content = content

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json()
        let commentResponse = this.parseResponseComment(data)

        this.commentService.pushComment(commentResponse);

        return commentResponse;
      }).catch(res => {
          // TODO: error;
      });
  }

  getComment(liveId: string, commentId: string): Promise<CommentModel> {
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments/${commentId}`

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json()
        let comment = this.parseComment(data, data.users)
        return comment
      }).catch(res => {
          // TODO: error;
      });
  }

  listComments(liveId: string, marker = '', limit = 20, sorts = ['-createdAt']): Promise<CommentModel[]> {
    var query = {
      createdAt: marker,
      limit: limit,
      sorts: sorts.join(',')
    };
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments?${$.param(query)}`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json();
        let comments: CommentModel[] = [];

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
