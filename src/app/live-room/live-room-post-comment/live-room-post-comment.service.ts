import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config'
import { GetCommentService } from '../../shared/comment/get-comment.service'
import { PostDanmuService } from '../../shared/comment/post-danmu.service'
import { AdditionalContentModel } from './live-room-post-comment.model'

@Injectable()
export class LiveRoomPostCommmentService {
  constructor (private getCommentService: GetCommentService, private postDanmuService: PostDanmuService) {}

  getComment(liveId: string, commentId: string): Promise<AdditionalContentModel> {
    return this.getCommentService.getComment(liveId, commentId).then(commentModel => {
      let additionalContentModel = new AdditionalContentModel()
      additionalContentModel.user = commentModel.user
      additionalContentModel.content = commentModel.content
      return additionalContentModel
    })
  }

  getDanmu(liveId: string, danmuId: string): Promise<AdditionalContentModel> {
    return this.postDanmuService.getDanmu(liveId, danmuId).then(danmuModel => {
      let additionalContentModel = new AdditionalContentModel()
      additionalContentModel.user = danmuModel.user
      additionalContentModel.content = danmuModel.content
      return additionalContentModel
    })
  }
}
