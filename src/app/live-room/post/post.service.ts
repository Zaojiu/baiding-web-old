import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { PostDanmuService } from '../../shared/comment/post-danmu.service'
import { AdditionalContentModel } from './post.model'
import { MessageApiService } from "../../shared/api/message.api";

@Injectable()
export class PostService {
  constructor (private messageApiService: MessageApiService, private postDanmuService: PostDanmuService) {}

  getMessage(liveId: string, messageId: string): Promise<AdditionalContentModel> {
    return this.messageApiService.getMessage(liveId, messageId).then(messageModel => {
      let additionalContentModel = new AdditionalContentModel()
      additionalContentModel.user = messageModel.user
      additionalContentModel.content = messageModel.content
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
