import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { AppConfig } from '../../app.config'
import { MessageType } from '../../live-room/timeline/message/message.enum';
import { MessageModel, AudioMessageModel, ReplyMessageModel } from '../../live-room/timeline/message/message.model';
import { PostMessageModel, PostAudioMessageModel, PostNiceMessageModel } from './message.model';
import { UserInfoService } from '../user-info/user-info.service';
import { TimelineService } from '../../live-room/timeline/timeline.service';

declare var $:any;

@Injectable()
export class MessageApiService {
  constructor (
    private http: Http,
    private config: AppConfig,
    private userInfoService: UserInfoService,
    private timelineService: TimelineService
  ) {}

  listMessages(liveId: string, marker = '', limit = 20, sorts = ['-createdAt'], parentId = 'null'): Promise<MessageModel[]> {
    var query = {
      createdAt: marker,
      limit: limit,
      sorts: sorts.join(','),
      parentId: parentId
    };
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/messages?${$.param(query)}`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json();
        let messages: MessageModel[] = [];

        if (data && data.result) {
          for (let messageData of data.result) {
            let message = this.parseMessage(messageData, data.include.users);
            messages.push(message);
          }
        }

        return messages;
      }).catch(res => {
        // TODO: error;
      });
  }

  getMessage(liveId: string, messageId: string): Promise<MessageModel> {
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/messages/${messageId}`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json()
        let message = this.parseMessage(data, data.users)

        return message;
      }).catch(res => {
        // TODO: error;
      });
  }

  parseMessage(data: any, users: any[]): MessageModel {
    data.replyMessages = data.replyMessages || []

    let message = new MessageModel();

    if (!data) return message

    message.id = data.id;
    message.isReceived = true;
    message.user = users[data.uid];
    message.content = data.content;

    if (data.type === 'text') message.type = MessageType.Text;
    if (data.type === 'image') message.type = MessageType.Image;
    if (data.type === 'audio') {
      message.type = MessageType.Audio
      message.audio = new AudioMessageModel()
      message.audio.localId = ''
      message.audio.serverId = data.audio.weixinId
      message.audio.translateResult = data.audio.text
    }
    if (data.type === 'nice') {
      message.type = MessageType.Nice
      message.user = users[data.nice.uid]
      message.content = data.nice.message
    };

    message.hadPraised = data.myPraisedId !== '';
    message.praisedAmount = data.praised;
    message.praisedAnimations = [];
    for (let uid of data.latestPraisedUids) {
      let user = users[uid];
      message.praisedAvatars = message.praisedAvatars || [];
      message.praisedAvatars.push(user);
    }
    message.replies = [];

    // 将推送消息的推送人和被推送人的内容交换
    if (data.type === 'nice') {
      let reply = new ReplyMessageModel();
      reply.id = data.id
      reply.user = users[data.uid]
      reply.content = data.content
      reply.createdAt = data.createdAt
      message.replies.push(reply)
    }

    // 包装回复消息
    for (let replyData of data.replyMessages) {
      let reply = new ReplyMessageModel();
      reply.id = replyData.id
      reply.user = users[replyData.uid]
      reply.content = replyData.content
      reply.createdAt = replyData.createdAt
      message.replies.push(reply)
    }

    message.createdAt = data.createdAt;

    return message;
  }

  parseResponesMessage(data: any, type: MessageType): MessageModel {
    let userInfo = this.userInfoService.getUserInfoCache();

    var message = new MessageModel();
    message.id = data.id;
    message.isReceived = false;
    message.user = userInfo;

    message.content = data.content;
    message.type = type;

    message.createdAt = +moment() * 1e6 + '';

    return message;
  }

  postTextMessage(liveId: string, content: string, replyParent = ''): Promise<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/messages`;
    let message = new PostMessageModel();
    message.type = 'text';
    message.content = content;

    if (replyParent) {
      message.parentId = replyParent
    }

    return this.http.post(url, JSON.stringify(message), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();

        if (replyParent != '') {
          for (let replyData of data.replyMessages) {
            let reply = new ReplyMessageModel();
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
          let messageResp = this.parseResponesMessage(data, MessageType.Text);
          this.timelineService.pushMessage(messageResp);

          return messageResp;
        }
      })
      .catch(res => {
        // TODO: error;
      });
  }

  postAudioMessage(liveId: string, localId: string, serverId: string, translateResult: string, link = ''): Promise<MessageModel> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/messages`;
    let message = new PostMessageModel()
    message.type = 'audio'
    message.audio = new PostAudioMessageModel()
    message.audio.text = translateResult
    message.audio.weixinId = serverId
    message.audio.link = link

    return this.http.post(url, JSON.stringify(message), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();
        let messageResp = this.parseResponesMessage(data, MessageType.Audio);

        messageResp.audio = new AudioMessageModel()
        messageResp.audio.localId = localId
        messageResp.audio.translateResult = translateResult

        this.timelineService.pushMessage(messageResp);

        return messageResp;
      })
      .catch(res => {
        // TODO: error;
      });
  }

  postNiceMessage(liveId: string, content: string, commentId: string, uid: number, commentContent: string): Promise<MessageModel> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/messages`;
    let message = new PostMessageModel()
    message.type = 'nice'
    message.content = content
    message.nice = new PostNiceMessageModel()
    message.nice.commentId = commentId
    message.nice.uid = uid
    message.nice.message = commentContent

    return this.http.post(url, JSON.stringify(message), {headers: headers}).toPromise()
      .then(res => {
        let data = res.json();
        let messageResp = this.parseResponesMessage(data, MessageType.Nice);

        if (data.type === 'nice') {
          messageResp.user = data.users[data.nice.uid]
          messageResp.content = data.nice.message

          let reply = new ReplyMessageModel();
          reply.id = data.id
          reply.user = data.users[data.uid]
          reply.content = data.content
          reply.createdAt = data.createdAt
          messageResp.replies.push(reply)
        }

        this.timelineService.pushMessage(messageResp);

        return messageResp;
      })
      .catch(res => {
        // TODO: error;
      });
  }
}
