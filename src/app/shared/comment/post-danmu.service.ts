import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config';
import { PostDanmuModel } from './post-danmu.model';
import { UserInfoService } from '../user-info/user-info.service';
import { UserInfoModel } from '../user-info/user-info.model';
import { LiveRoomCommentService } from '../../live-room/live-room-danmu/live-room-danmu.service';
import { LiveRoomDanmuModel } from '../../live-room/live-room-danmu/live-room-danmu.model';

declare var $:any;

@Injectable()
export class PostDanmuService {
  constructor (private http: Http, private config: AppConfig,
    private userInfoService: UserInfoService, private commentService: LiveRoomCommentService) { }

  parseDanmu(data: any, users: any): LiveRoomDanmuModel {
    var danmu = new LiveRoomDanmuModel()

    if (!data) return danmu

    danmu.id = data.id
    danmu.user = users[data.uid] as UserInfoModel
    danmu.msgId = data.msgId
    danmu.content = data.content
    danmu.createdAt = data.createdAt

    return danmu
  }

  parseResponseDanmu(data: any): LiveRoomDanmuModel {
    var danmu = new LiveRoomDanmuModel()
    let userInfo = this.userInfoService.getUserInfoCache();

    if (!data) return danmu

    danmu.id = data.id
    danmu.user = userInfo
    danmu.msgId = data.msgId
    danmu.content = data.content
    danmu.createdAt = data.createdAt

    return danmu
  }

  postDanmu(liveId, content): Promise<LiveRoomDanmuModel> {
    let headers = new Headers({'Content-Type': 'application/json'})
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments`
    let comment = new PostDanmuModel()
    comment.content = content

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json()
        let commentResponse = this.parseResponseDanmu(data)

        this.commentService.pushComment(commentResponse);

        return commentResponse;
      }).catch(res => {
          // TODO: error;
      });
  }

  getDanmu(liveId: string, danmuId: string): Promise<LiveRoomDanmuModel> {
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments/${danmuId}`

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json()
        let danmu = this.parseDanmu(data, data.users)
        return danmu
      }).catch(res => {
          // TODO: error;
      });
  }

  listDanmus(liveId: string, marker = '', limit = 20, sorts = ['-createdAt']): Promise<LiveRoomDanmuModel[]> {
    var query = {
      createdAt: marker,
      limit: limit,
      sorts: sorts.join(',')
    };
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/comments?${$.param(query)}`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json();
        let danmus: LiveRoomDanmuModel[] = [];

        if (data && data.result) {
          for (let danmuData of data.result) {
            let danmu = this.parseDanmu(danmuData, data.include.users);
            danmus.push(danmu);
          }
        }

        return danmus;
      }).catch(res => {
          // TODO: error;
      });
  }
}
