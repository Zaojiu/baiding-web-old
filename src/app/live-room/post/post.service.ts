import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { CommentApiService } from '../../shared/api/comment.service'
import { AdditionalContentModel } from './post.model'
import { MessageApiService } from "../../shared/api/message.api";

@Injectable()
export class PostService {
  constructor (private messageApiService: MessageApiService, private commentApiService: CommentApiService) {}

  getMessage(liveId: string, messageId: string): Promise<AdditionalContentModel> {
    return this.messageApiService.getMessage(liveId, messageId).then(messageModel => {
      let additionalContentModel = new AdditionalContentModel()
      additionalContentModel.user = messageModel.user
      additionalContentModel.content = messageModel.content
      return additionalContentModel
    })
  }

  getComment(liveId: string, commentId: string): Promise<AdditionalContentModel> {
    return this.commentApiService.getComment(liveId, commentId).then(commentModel => {
      let additionalContentModel = new AdditionalContentModel()
      additionalContentModel.user = commentModel.user
      additionalContentModel.content = commentModel.content
      return additionalContentModel
    })
  }
}
