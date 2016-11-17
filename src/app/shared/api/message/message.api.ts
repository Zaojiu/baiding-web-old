import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {MessageType, PostMessageStatus} from './message.enum';
import {
  MessageModel, AudioMessageModel, ReplyMessageModel,
  ImageMessageModel, UploadTokenModel, PostPraiseModel
} from './message.model';
import {PostMessageModel, PostAudioMessageModel, PostNiceMessageModel, PostImageMessageModel} from './message.model';
import {UserInfoService} from '../user-info/user-info.service';
import {TimelineService} from '../../../live-room/timeline/timeline.service';
import {UploadApiService} from '../upload/upload.api'
import {environment} from "../../../../environments/environment";
import {UtilsService} from "../../utils/utils";
import {AudioBridge} from "../../bridge/audio.interface";
import {UserInfoModel} from "../user-info/user-info.model";

declare var $: any;

@Injectable()
export class MessageApiService {
  constructor(private http: Http, private userInfoService: UserInfoService, private timelineService: TimelineService,
              private uploadService: UploadApiService, private audioService: AudioBridge) {
  }

  postQueue: PostMessageModel[] = [];
  posting: boolean;

  listMessages(liveId: string, marker = '', size = 20, sorts = ['-createdAt'], parentId = 'null'): Promise<MessageModel[]> {
    var query = {
      createdAt: marker,
      size: size,
      sorts: sorts.join(','),
      parentId: parentId
    };


    const url = `${environment.config.host.io}/api/live/streams/${liveId}/messages?${$.param(query)}`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let messages: MessageModel[] = [];

      if (data && data.result) {
        for (let messageData of data.result) {
          let message = this.parseMessage(messageData, data.include.users);
          messages.push(message);
        }
      }

      return messages;
    });
  }

  getMessage(liveId: string, messageId: string): Promise<MessageModel> {
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/${messageId}`;

    return this.http.get(url).toPromise()
      .then(res => {
        let data = res.json();
        let message = this.parseMessage(data, data.users);

        return message;
      }).catch(res => {
        // TODO: error;
      });
  }

  parseMessage(data: any, users: any[]): MessageModel {
    data.replyMessages = data.replyMessages || [];

    let message = new MessageModel();

    if (!data) return message;

    message.id = data.id;
    message.parentId = data.parentId;
    message.isReceived = true;
    message.user = users[data.uid];
    message.content = data.content;

    if (data.type === 'text') message.type = MessageType.Text;
    if (data.type === 'audio') {
      message.type = MessageType.Audio;
      message.audio = new AudioMessageModel();
      message.audio.localId = '';
      message.audio.serverId = data.audio.weixinId;
      message.audio.translateResult = data.audio.text;
      message.audio.link = data.audio.link;
      message.audio.duration = data.audio.duration;
    }

    if (data.type === 'image') {
      message.type = MessageType.Image;
      message.image = new ImageMessageModel();
      message.image.link = data.image.link;
      message.image.smallLink = data.image.smallLink;
      message.image.thumbLink = data.image.thumbLink;
    }

    if (data.type === 'nice') {
      message.type = MessageType.Nice;
      message.user = users[data.nice.uid];
      message.content = data.nice.message;
    }

    if (data.type === 'editorJoin') {
      message.type = MessageType.EditorJoin;
      return message;
    }

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
      // 有内容的推送才会把推送语作为第一条回复
      if (data.content) {
        let reply = new ReplyMessageModel();
        reply.id = data.id;
        reply.user = users[data.uid];
        reply.content = data.content;
        reply.createdAt = data.createdAt;
        message.replies.push(reply);
      }
    }

    // 包装回复消息
    for (let replyData of data.replyMessages) {
      let reply = new ReplyMessageModel();
      reply.id = replyData.id;
      reply.user = users[replyData.uid];
      reply.content = replyData.content;
      reply.createdAt = replyData.createdAt;
      message.replies.push(reply)
    }

    message.createdAt = data.createdAt;

    return message;
  }

  private postMessage() {
    if (this.postQueue.length === 0 || this.posting) return;

    this.posting = true;

    let postMessage = this.postQueue.shift();
    let postMessageCopy = _.clone(postMessage);
    let originMessage = postMessage.originMessage;
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${environment.config.host.io}/api/live/streams/${postMessageCopy.liveId}/messages`;

    delete postMessageCopy.originMessage;

    if (originMessage instanceof MessageModel && (originMessage as MessageModel).type === MessageType.Audio) {
      // 处理音频信息
      let _originMessage = originMessage as MessageModel;

      this.audioService.translateVoice(_originMessage.audio.localId).then((translateResult) => {
        _originMessage.audio.translateResult = translateResult;
        postMessage.audio.text = translateResult;

        this.audioService.uploadVoice(_originMessage.audio.localId).then((serverId) => {
          _originMessage.audio.serverId = serverId;
          postMessage.audio.weixinId = serverId;
          delete postMessageCopy.audio.audioData;

          this.http.post(url, JSON.stringify(postMessageCopy), {headers: headers}).toPromise().then(res => {
            let data = res.json();

            _originMessage.audio.duration = data.audio.duration; // 从服务端校准数据
            _originMessage.id = data.id;
            _originMessage.postStatus = PostMessageStatus.PostSuccessful;
          }, (err) => {
            _originMessage.postStatus = PostMessageStatus.PostFailed;
          });
        }, () => {
          _originMessage.postStatus = PostMessageStatus.UploadFailed;
        });
      }, () => {
        _originMessage.postStatus = PostMessageStatus.TranslateFailed;
      }).finally(() => {
        this.posting = false;
        this.postMessage();
      });
    } else if (originMessage instanceof MessageModel && (originMessage as MessageModel).type === MessageType.Image) {
      // 处理图片信息
      this.getUploadToken(postMessage.liveId).then((token) => {
        return this.uploadService.uploadToQiniu(postMessage.image.imageData, token.key, token.token);
      }).then((key) => {
        postMessageCopy.image.key = key;
        delete postMessageCopy.image.imageData;

        return this.http.post(url, JSON.stringify(postMessageCopy), {headers: headers}).toPromise().then(res => {
          let data = res.json();

          originMessage.postStatus = PostMessageStatus.PostSuccessful;
          originMessage.id = data.id;
        }, () => {
          originMessage.postStatus = PostMessageStatus.PostFailed;
        });
      }).catch(() => {
        originMessage.postStatus = PostMessageStatus.UploadFailed;
      }).finally(() => {
        this.posting = false;
        this.postMessage();
      });
    } else {
      // 处理普通信息

      this.http.post(url, JSON.stringify(postMessageCopy), {headers: headers}).toPromise().then(res => {
        let data = res.json();

        originMessage.postStatus = PostMessageStatus.PostSuccessful;
        originMessage.id = data.id;
      }, (err) => {
        originMessage.postStatus = PostMessageStatus.PostFailed;
      }).finally(() => {
        this.posting = false;
        this.postMessage();
      });
    }
  }

  postTextMessage(liveId: string, content: string, replyParent = '') {
    let postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'text';
    postMessage.content = content;
    postMessage.parentId = replyParent;

    let userInfo = this.userInfoService.getUserInfoCache();

    if (replyParent !== '') {
      let message = new ReplyMessageModel();

      message.id = UtilsService.randomId();
      message.parentId = replyParent;
      message.user = userInfo;
      message.content = content;
      message.createdAt = +moment() * 1e6 + '';
      message.postStatus = PostMessageStatus.Pending;

      postMessage.originMessage = message;

      this.timelineService.pushReply(message);
    } else {
      let message = new MessageModel();

      message.id = UtilsService.randomId();
      message.parentId = '';
      message.isReceived = false;
      message.user = userInfo;
      message.content = content;
      message.type = MessageType.Text;
      message.createdAt = +moment() * 1e6 + '';
      message.postStatus = PostMessageStatus.Pending;

      postMessage.originMessage = message;

      this.timelineService.pushMessage(message);
    }

    this.postQueue.push(postMessage);
    this.postMessage();
  }

  postAudioMessage(liveId: string, localId: string, audioData: Blob, duration: number = 0) {
    if (!audioData && !localId) {
      throw new Error('no audio data or audio local id');
    }

    let postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'audio';
    postMessage.audio = new PostAudioMessageModel();
    postMessage.audio.audioData = audioData;
    postMessage.audio.localId = localId;
    postMessage.audio.duration = duration;

    let message = new MessageModel();
    let userInfo = this.userInfoService.getUserInfoCache();

    message.id = UtilsService.randomId();
    message.parentId = '';
    message.isReceived = false;
    message.user = userInfo;
    message.content = '';
    message.type = MessageType.Audio;
    message.createdAt = +moment() * 1e6 + '';
    message.postStatus = PostMessageStatus.Pending;
    message.audio = new AudioMessageModel();
    message.audio.localId = localId;
    message.audio.audioData = audioData; // TODO: 本地播放, 还要可以播放Blob中的数据.
    message.audio.duration = duration;

    postMessage.originMessage = message;

    this.timelineService.pushMessage(message);
    this.postQueue.push(postMessage);
    this.postMessage();
  }

  postNiceMessage(liveId: string, content: string, originCommentId: string, originUserInfo: UserInfoModel, originContent: string) {
    let postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'nice';
    postMessage.content = content;
    postMessage.nice = new PostNiceMessageModel();
    postMessage.nice.commentId = originCommentId;
    postMessage.nice.uid = originUserInfo.uid;
    postMessage.nice.message = originContent;

    let message = new MessageModel();
    let userInfo = this.userInfoService.getUserInfoCache();

    message.id = UtilsService.randomId();
    message.parentId = '';
    message.isReceived = false;
    message.user = originUserInfo;
    message.content = originContent;
    message.type = MessageType.Nice;
    message.createdAt = +moment() * 1e6 + '';
    message.postStatus = PostMessageStatus.Pending;

    let reply = new ReplyMessageModel();
    reply.id = originCommentId;
    reply.user = userInfo;
    reply.content = content;
    reply.createdAt = +moment() * 1e6 + '';
    message.replies.push(reply);

    postMessage.originMessage = message;

    this.timelineService.pushMessage(message);
    this.postQueue.push(postMessage);
    this.postMessage();
  }

  postImageMessage(liveId: string, file: File) {
    let postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'image';
    postMessage.image = new PostImageMessageModel();
    postMessage.image.imageData = file;

    let message = new MessageModel();
    let userInfo = this.userInfoService.getUserInfoCache();

    message.id = UtilsService.randomId();
    message.parentId = '';
    message.isReceived = false;
    message.user = userInfo;
    message.content = '';
    message.type = MessageType.Image;
    message.createdAt = +moment() * 1e6 + '';
    message.postStatus = PostMessageStatus.Pending;

    message.image = new ImageMessageModel();
    message.image.imageData = file; // TODO: timeline中需要打开File

    postMessage.originMessage = message;

    this.timelineService.pushMessage(message);
    this.postQueue.push(postMessage);
    this.postMessage();
  }

  resendMessage(liveId: string, message: MessageModel|ReplyMessageModel) {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/messages`;

    if (message instanceof MessageModel && (message as MessageModel).type === MessageType.Audio) {
      // 处理音频信息
      let postMessage = new PostMessageModel();
      let originMessage = message as MessageModel;
      postMessage.type = 'audio';
      postMessage.audio = new PostAudioMessageModel();
      postMessage.audio.audioData = originMessage.audio.audioData;
      postMessage.audio.localId = originMessage.audio.localId;
      postMessage.audio.duration = originMessage.audio.duration;

      this.audioService.translateVoice(originMessage.audio.localId).then((translateResult) => {
        originMessage.audio.translateResult = translateResult;
        postMessage.audio.text = translateResult;

        this.audioService.uploadVoice(originMessage.audio.localId).then((serverId) => {
          originMessage.audio.serverId = serverId;
          postMessage.audio.weixinId = serverId;

          this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise().then(res => {
            let data = res.json();

            originMessage.audio.duration = data.audio.duration; // 从服务端校准数据
            originMessage.id = data.id;
            originMessage.postStatus = PostMessageStatus.PostSuccessful;
            this.timelineService.deleteMessage(originMessage);
            this.timelineService.pushMessage(originMessage);
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.PostFailed;
          });
        }, () => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
        });
      }, () => {
        originMessage.postStatus = PostMessageStatus.TranslateFailed;
      });
    } else if (message instanceof MessageModel && (message as MessageModel).type === MessageType.Image) {
      // 处理图片信息
      let originMessage = message as MessageModel;
      let postMessage = new PostMessageModel();
      postMessage.type = 'image';
      postMessage.image = new PostImageMessageModel();
      postMessage.image.imageData = originMessage.image.imageData;

      this.getUploadToken(liveId).then((token) => {
        return this.uploadService.uploadToQiniu(originMessage.image.imageData, token.key, token.token);
      }).then((key) => {
        postMessage.image.key = key;

        this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise().then(res => {
          let data = res.json();

          originMessage.postStatus = PostMessageStatus.PostSuccessful;
          originMessage.id = data.id;

          this.timelineService.deleteMessage(originMessage);
          this.timelineService.pushMessage(originMessage);
        }, () => {
          originMessage.postStatus = PostMessageStatus.PostFailed;
        });
      }).catch(() => {
        originMessage.postStatus = PostMessageStatus.UploadFailed;
      });
    } else {
      // 处理普通信息
      let postMessage = new PostMessageModel();

      if (
        (message instanceof MessageModel && (message as MessageModel).type === MessageType.Text) ||
        message instanceof ReplyMessageModel
      ) {
        postMessage.type = 'text';
        postMessage.content = message.content;
        postMessage.parentId = message.parentId;
      } else if (message instanceof MessageModel && (message as MessageModel).type === MessageType.Nice) {
        let originMessage = message as MessageModel;
        postMessage.type = 'nice';
        postMessage.content = originMessage.replies[0].content;
        postMessage.nice = new PostNiceMessageModel();
        postMessage.nice.commentId = originMessage.replies[0].id;
        postMessage.nice.uid = originMessage.user.uid;
        postMessage.nice.message = originMessage.content;
      }

      this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise().then(res => {
        let data = res.json();

        message.postStatus = PostMessageStatus.PostSuccessful;
        message.id = data.id;

        if (message instanceof MessageModel)  {
          this.timelineService.deleteMessage(message);
          this.timelineService.pushMessage(message);
        }
      }, (err) => {
        message.postStatus = PostMessageStatus.PostFailed;
      });
    }
  }

  getUploadToken(liveId: string): Promise<UploadTokenModel> {
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/image/uptoken`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();

      let uploadTokenModel = new UploadTokenModel(data.token, data.key);

      return uploadTokenModel;
    });
  }

  rerangeHistoryMessage(messages: MessageModel[]): MessageModel[] {
    let rerangedMessages: MessageModel[] = [];

    for (let message of messages) {
      if (message.parentId !== '') {
        for (let parentMessage of messages) {
          if (parentMessage.id == message.parentId) {
            parentMessage.replies.push(message);
            break;
          }
        }
      } else {
        rerangedMessages.push(message);
      }
    }

    return rerangedMessages;
  }

  history(liveId: string): Promise<MessageModel[]> {
    let url = `${environment.config.host.io}/api/live/streams/${liveId}/all_messages`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let messages: MessageModel[] = [];

      if (data && data.result) {
        for (let messageData of data.result) {
          let message = this.parseMessage(messageData, data.include.users);
          messages.push(message);
        }
      }

      messages = this.rerangeHistoryMessage(messages);

      return messages;
    });
  }

  praise(liveId: string, msgId: string, praised: boolean, num: number): Promise<void> {
    let data = new PostPraiseModel();
    data.praised = praised;
    data.num = num;

    let url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/${msgId}/praises`;
    return this.http.post(url, JSON.stringify(data)).toPromise().then(res => {
      return;
    });
  }

  cancelPraise(liveId: string, msgId: string): Promise<void> {
    let url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/${msgId}/praises`;

    return this.http.delete(url, null).toPromise().then(res => {
      return;
    });
  }
}
