import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {AppConfig} from '../../../app.config';
import {PostCommentModel, CommentType} from './comment.model';
import {UserInfoService} from '../user-info/user-info.service';
import {UserInfoModel} from '../user-info/user-info.model';
import {CommentService} from '../../../live-room/comment/comment.service';
import {CommentModel} from './comment.model';

declare var $: any;

@Injectable()
export class CommentApiService {
  constructor(private http: Http, private config: AppConfig,
              private userInfoService: UserInfoService, private commentService: CommentService) {
  }

  parseComment(data: any, users: any): CommentModel {
    let comment = new CommentModel()

    if (!data) return comment;

    comment.id = data.id;
    comment.user = users[data.uid] as UserInfoModel;
    comment.msgId = data.msgId;
    comment.type = CommentType.Text;
    comment.content = data.content;
    comment.toUsers = [];
    comment.toUids = data.toUids || [];
    comment.createdAt = data.createdAt;

    if (data.toUids && data.toUids.length) {
      for (let uid of data.toUids) {
        comment.toUsers.push((users[uid] as UserInfoModel));
      }
    }

    return comment
  }

  parseResponseComment(data: any): CommentModel {
    var comment = new CommentModel();
    let userInfo = this.userInfoService.getUserInfoCache();

    if (!data) return comment;

    comment.id = data.id;
    comment.user = userInfo;
    comment.type = CommentType.Text;
    comment.msgId = data.msgId;
    comment.content = data.content;
    comment.createdAt = data.createdAt;

    return comment
  }

  postComment(liveId: string, content: string, toUsers: UserInfoModel[] = []): Promise<CommentModel> {
    let headers = new Headers({'Content-Type': 'application/json'})
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments`
    let comment = new PostCommentModel();
    comment.content = content;
    comment.toUids = [];
    for (let user of toUsers) {
      comment.toUids.push(user.uid);
    }

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();

        let commentResponse = this.parseResponseComment(data);

        commentResponse.toUsers = toUsers;
        commentResponse.toUids = comment.toUids;

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
        let data = res.json();
        let comment = this.parseComment(data, data.users);
        return comment;
      }).catch(res => {
        // TODO: error;
      });
  }

  listComments(liveId: string, toUids: number[] = [], marker = '', size = 20, sorts = ['-createdAt']): Promise<CommentModel[]> {
    let query: any = {
      createdAt: marker,
      size: size,
      sorts: sorts.join(','),
    };
    if (toUids.length) query.toUids = toUids.join(',');

    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments?${$.param(query)}`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let comments: CommentModel[] = [];

      if (data && data.result) {
        for (let commentData of data.result) {
          let comment = this.parseComment(commentData, data.include.users);
          comments.push(comment);
        }
      }

      return comments;
    });
  }
}
