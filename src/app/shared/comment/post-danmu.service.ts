import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config';
import { PostDanmuModel } from './post-danmu.model';
import { UserInfoService } from '../user-info/user-info.service';
import { LiveRoomCommentService } from '../../live-room/live-room-danmu/live-room-danmu.service';
import { LiveRoomDanmuModel } from '../../live-room/live-room-danmu/live-room-danmu.model';

@Injectable()
export class PostDanmuService {
  constructor (private http: Http, private config: AppConfig,
    private userInfoService: UserInfoService, private commentService: LiveRoomCommentService) { }

  postDanmu(liveId, content): Promise<LiveRoomDanmuModel> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/comments`;
    let comment = new PostDanmuModel();
    comment.content = content;

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();
        let userInfo = this.userInfoService.getUserInfoCache();

        var comment = new LiveRoomDanmuModel();
        comment.id = data.id;
        comment.user = userInfo;
        comment.content = content;

        this.commentService.pushComment(comment);

        return comment;
      }).catch(res => {
          // TODO: error;
      });
  }
}
