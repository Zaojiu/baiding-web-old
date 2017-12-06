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
import {TimelineService} from '../../../+live-room/timeline/timeline.service';
import {UploadApiService} from '../upload/upload.api'
import {environment} from "../../../../environments/environment";
import {UtilsService} from "../../utils/utils";
import {AudioBridge} from "../../bridge/audio.interface";
import {UserInfoModel} from "../user-info/user-info.model";
import {ImageBridge} from "../../bridge/image.interface";
import {StoreService} from "../../store/store.service";

import { AnalyticsService, TargetInfo, ObjectType } from "../../analytics/analytics.service"
import {DomSanitizer} from "@angular/platform-browser";

declare var $: any;

@Injectable()
export class MessageApiService {
  constructor(private http: Http, private userInfoService: UserInfoService, private timelineService: TimelineService,
              private uploadService: UploadApiService, private audioService: AudioBridge,
              private analytics: AnalyticsService,private sanitizer:DomSanitizer,
              private imageService: ImageBridge) {
  }

  postQueue: PostMessageModel[] = [];
  posting: boolean;

  listMessages(liveId: string, marker = '', size = 20, sorts = ['-createdAt']): Promise<MessageModel[]> {
    const query = {
      createdAt: marker,
      size: size,
      sorts: sorts.join(','),
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

    if (!data) {
      return message;
    }

    message.id = data.id;
    message.parentId = data.parentId;
    message.isReceived = true;
    if (data.uid !== 0) {
      if (users[data.uid]) {
        message.user = users[data.uid];
      } else {
        throw new Error('users[data.uid not find!');
      }
    }
    message.content = data.content;
    message.createdAt = data.createdAt;
    if (message.content) {
      let contentParsed = UtilsService.parseAt(message.content);
      contentParsed = UtilsService.parseLink(contentParsed);
      message.contentParsed = this.sanitizer.bypassSecurityTrustHtml(contentParsed);
    }

    if (data.type === 'text') message.type = MessageType.Text;
    if (data.type === 'audio') {
      message.type = MessageType.Audio;
      message.audio = new AudioMessageModel();
      message.audio.localId = '';
      message.audio.serverId = data.audio.weixinId;
      message.audio.translateResult = data.content || data.audio.text;
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

      // 有内容的推送才会把推送语作为第一条回复
      if (data.content) {
        message.parentMessage = new MessageModel;
        message.parentMessage.id = data.id;
        message.parentMessage.type = MessageType.Nice;
        message.parentMessage.user = users[data.nice.uid];
        message.parentMessage.content = data.nice.message;
        let contentParsed = UtilsService.parseAt(message.parentMessage.content);
        contentParsed = UtilsService.parseLink(contentParsed);
        message.parentMessage.contentParsed = this.sanitizer.bypassSecurityTrustHtml(contentParsed);
        message.parentMessage.createdAt = data.createdAt; // TODO: 可能需要原创建时间
        message.parentMessage.createdAtParsed = moment(+message.parentMessage.createdAt / 1e6);
      } else {
        message.user = users[data.nice.uid];
        message.content = data.nice.message;
        let contentParsed = UtilsService.parseAt(message.content);
        contentParsed = UtilsService.parseLink(contentParsed);
        message.contentParsed = this.sanitizer.bypassSecurityTrustHtml(contentParsed);
      }
    }

    if (data.type === 'editorJoin') {
      message.type = MessageType.EditorJoin;
      return message;
    }

    if (data.type === 'start') {
      message.type = MessageType.LiveStart;
      return message;
    }

    message.hadPraised = data.myPraisedId !== '';
    message.praisedAmount = data.praised;
    message.praisedAnimations = [];

    data.latestPraisedUids = data.latestPraisedUids || [];
    for (let uid of data.latestPraisedUids) {
      let user = users[uid];
      message.praisedAvatars = message.praisedAvatars || [];
      if (user) {
        message.praisedAvatars.push(user);
      }
    }

    message.replies = [];

    if (data.parentMessage) {
      message.parentMessage = this.parseMessage(data.parentMessage, users);
    }
    message.createdAtParsed = moment(+message.createdAt / 1e6);

    return message;
  }

  private postMessage(): Promise<MessageModel> {
    if (this.postQueue.length === 0 || this.posting) return null;

    this.posting = true;

    return new Promise((resolve, reject) => {


      let postMessage = this.postQueue.shift();
      let postMessageCopy = _.clone(postMessage);
      let originMessage = postMessage.originMessage;
      let headers = new Headers({'Content-Type': 'application/json'});
      const url = `${environment.config.host.io}/api/live/streams/${postMessageCopy.liveId}/messages`;

      delete postMessageCopy.originMessage;

      if (originMessage instanceof MessageModel && (originMessage as MessageModel).type === MessageType.Audio) {
        // 处理音频信息
        let _originMessage = originMessage as MessageModel;
        let promise = null;

        if (UtilsService.isInWechat) {
          promise = this.audioService.uploadVoice(_originMessage.audio.localId).then((serverId) => {
            postMessage.audio.weixinId = serverId;

            return this.http.post(url, JSON.stringify(postMessageCopy), {headers: headers}).toPromise();
          }, (err) => {
            _originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          });
        } else if (UtilsService.isInApp) {
          promise = this.getAudioUploadToken(postMessage.liveId).then((token) => {
            postMessage.audio.qiniuKey = token.key;

            return this.uploadService.uploadToQiniu(_originMessage.audio.audioData, token.key, token.token);
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          }).then(() => {
            return this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise();
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          });
        } else {
          let encodeAmr = null;

          promise = this.audioService.encodeVoice(_originMessage.audio.audioData).then((encodeAmrBlob) => {
            encodeAmr = encodeAmrBlob;
            return this.getAudioUploadToken(postMessage.liveId);
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          }).then((token) => {
            postMessage.audio.qiniuKey = token.key;

            return this.uploadService.uploadToQiniu(encodeAmr, token.key, token.token);
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          }).then(() => {
            return this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise();
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          });
        }

        promise.then(res => {
          let data = res.json();

          _originMessage.id = data.id;
          _originMessage.audio.link = data.audio.link;
          _originMessage.audio.duration = data.audio.duration; // 从服务端校准数据
          _originMessage.audio.translateResult = data.content || data.audio.text;
          _originMessage.postStatus = PostMessageStatus.PostSuccessful;
          resolve(data);
        }, (err) => {
          reject(err);
          _originMessage.postStatus = PostMessageStatus.PostFailed;
        }).finally(() => {
          this.posting = false;
          this.postMessage();
        });
      } else if (originMessage instanceof MessageModel && (originMessage as MessageModel).type === MessageType.Image) {
        // 处理图片信息
        let _originMessage = originMessage as MessageModel;

        let promise = null;

        if (UtilsService.isInWechat) {
          promise = this.imageService.uploadImage(_originMessage.image.localId).then((serverId) => {
            postMessageCopy.image.weixinId = serverId;
            return this.http.post(url, JSON.stringify(postMessageCopy), {headers: headers}).toPromise();
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          });
        } else {
          promise = this.getImageUploadToken(postMessage.liveId).then((token) => {
            return this.uploadService.uploadToQiniu(_originMessage.image.imageData, token.key, token.token);
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          }).then((key) => {
            postMessageCopy.image.key = key;
            return this.http.post(url, JSON.stringify(postMessageCopy), {headers: headers}).toPromise();
          }, (err) => {
            originMessage.postStatus = PostMessageStatus.UploadFailed;
            return Promise.reject(err);
          });
        }

        promise.then(res => {
          let data = res.json();

          originMessage.postStatus = PostMessageStatus.PostSuccessful;
          originMessage.id = data.id;
          (originMessage as MessageModel).image = data.image;
          resolve(data);
        }, () => {
          originMessage.postStatus = PostMessageStatus.PostFailed;
        }).finally(() => {
          this.posting = false;
          this.postMessage();
        });
      } else {
        // 处理普通信息

        return this.http.post(url, JSON.stringify(postMessageCopy), {headers: headers}).toPromise().then(res => {
          let data = res.json();

          originMessage.postStatus = PostMessageStatus.PostSuccessful;
          originMessage.id = data.id;
          resolve(data);
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.PostFailed;
        }).finally(() => {
          this.posting = false;
          this.postMessage();
        });
      }
    });
  }

  postTextMessage(liveId: string, content: string, replyMessage: MessageModel = null): Promise<MessageModel> {
    const postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'text';
    postMessage.content = content;
    if (replyMessage) postMessage.parentId = replyMessage.id;

    const userInfo = this.userInfoService.getUserInfoCache();
    const message = new MessageModel();

    if (replyMessage) {
      message.parentId = replyMessage.id;
      message.parentMessage = replyMessage;
    }

    message.id = UtilsService.randomId();
    message.isReceived = false;
    message.user = userInfo;
    message.content = content;
    message.contentParsed = UtilsService.parseAt(content);
    message.type = MessageType.Text;
    message.createdAt = +moment() * 1e6 + '';
    message.postStatus = PostMessageStatus.Pending;

    postMessage.originMessage = message;

    this.timelineService.pushMessage(message);

    this.postQueue.push(postMessage);
    return this.postMessage();
  }

  postAudioMessage(liveId: string, localId: string, audioData: Blob, duration: number = 0, replyMessage: MessageModel = null): Promise<MessageModel> {
    if (!audioData && !localId) {
      throw new Error('no audio data or audio local id');
    }

    const postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'audio';
    postMessage.audio = new PostAudioMessageModel();
    postMessage.audio.duration = duration;
    if (replyMessage) postMessage.parentId = replyMessage.id;

    const message = new MessageModel();
    const userInfo = this.userInfoService.getUserInfoCache();

    if (replyMessage) {
      message.parentId = replyMessage.id;
      message.parentMessage = replyMessage;
    }

    message.id = UtilsService.randomId();
    message.isReceived = false;
    message.user = userInfo;
    message.content = '';
    message.contentParsed = UtilsService.parseAt('');
    message.type = MessageType.Audio;
    message.createdAt = +moment() * 1e6 + '';
    message.postStatus = PostMessageStatus.Pending;
    message.audio = new AudioMessageModel();
    message.audio.localId = localId;
    message.audio.audioData = audioData;
    message.audio.duration = duration;

    postMessage.originMessage = message;

    this.timelineService.pushMessage(message);
    this.postQueue.push(postMessage);
    return this.postMessage();
  }

  postNiceMessage(liveId: string, content: string, originCommentId: string, originUserInfo: UserInfoModel, originContent: string) {
    const postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'nice';
    postMessage.content = content;
    postMessage.nice = new PostNiceMessageModel();
    postMessage.nice.commentId = originCommentId;
    postMessage.nice.uid = originUserInfo.uid;
    postMessage.nice.message = originContent;

    const message = new MessageModel();
    const userInfo = this.userInfoService.getUserInfoCache();

    message.id = UtilsService.randomId();
    message.parentId = '';
    message.isReceived = false;
    message.user = originUserInfo;
    message.content = originContent;
    message.contentParsed = UtilsService.parseAt(originContent);
    message.type = MessageType.Nice;
    message.createdAt = +moment() * 1e6 + '';
    message.postStatus = PostMessageStatus.Pending;

    const reply = new ReplyMessageModel();
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

  postImageMessage(liveId: string, localId: string, file: File, replyMessage: MessageModel = null): Promise<MessageModel> {
    const postMessage = new PostMessageModel();
    postMessage.liveId = liveId;
    postMessage.type = 'image';
    postMessage.image = new PostImageMessageModel();
    if (replyMessage) postMessage.parentId = replyMessage.id;

    const message = new MessageModel();
    const userInfo = this.userInfoService.getUserInfoCache();

    if (replyMessage) {
      message.parentId = replyMessage.id;
      message.parentMessage = replyMessage;
    }

    message.id = UtilsService.randomId();
    message.isReceived = false;
    message.user = userInfo;
    message.content = '';
    message.contentParsed = UtilsService.parseAt('');
    message.type = MessageType.Image;
    message.createdAt = +moment() * 1e6 + '';
    message.postStatus = PostMessageStatus.Pending;

    message.image = new ImageMessageModel();
    message.image.imageData = file;
    message.image.localId = localId;

    postMessage.originMessage = message;

    this.timelineService.pushMessage(message);
    this.postQueue.push(postMessage);
    return this.postMessage();
  }

  resendMessage(liveId: string, message: MessageModel|ReplyMessageModel) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/messages`;

    message.postStatus = PostMessageStatus.Pending;

    if (message instanceof MessageModel && (message as MessageModel).type === MessageType.Audio) {
      // 处理音频信息
      let postMessage = new PostMessageModel();
      let originMessage = message as MessageModel;
      postMessage.type = 'audio';
      postMessage.audio = new PostAudioMessageModel();
      postMessage.audio.duration = originMessage.audio.duration;

      let promise = null;

      if (UtilsService.isInWechat) {
        promise = this.audioService.uploadVoice(originMessage.audio.localId).then((serverId) => {
          postMessage.audio.weixinId = serverId;

          return this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise();
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        });
      } else if (UtilsService.isInApp) {
        promise = this.getAudioUploadToken(liveId).then((token) => {
          postMessage.audio.qiniuKey = token.key;

          return this.uploadService.uploadToQiniu(originMessage.audio.audioData, token.key, token.token);
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        }).then(() => {
          return this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise();
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        });
      } else {
        let encodeAmr = null;

        promise = this.audioService.encodeVoice(originMessage.audio.audioData).then((encodeAmrBlob) => {
          encodeAmr = encodeAmrBlob;
          return this.getAudioUploadToken(postMessage.liveId);
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        }).then((token) => {
          postMessage.audio.qiniuKey = token.key;
          return this.uploadService.uploadToQiniu(encodeAmr, token.key, token.token);
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        }).then(() => {
          return this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise();
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        });
      }

      promise.then(res => {
        let data = res.json();

        originMessage.id = data.id;
        originMessage.audio.duration = data.audio.duration; // 从服务端校准数据
        originMessage.audio.translateResult = data.content || data.audio.text;
        originMessage.postStatus = PostMessageStatus.PostSuccessful;
        this.timelineService.deleteMessage(originMessage);
        this.timelineService.pushMessage(originMessage);
      }, (err) => {
        originMessage.postStatus = PostMessageStatus.PostFailed;
      });
    } else if (message instanceof MessageModel && (message as MessageModel).type === MessageType.Image) {
      // 处理图片信息
      let originMessage = message as MessageModel;
      let postMessage = new PostMessageModel();
      postMessage.type = 'image';
      postMessage.image = new PostImageMessageModel();

      let promise = null;

      if (UtilsService.isInWechat) {
        promise = this.imageService.uploadImage(originMessage.image.localId).then((serverId) => {
          postMessage.image.weixinId = serverId;
          return this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise();
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        });
      } else {
        promise = this.getImageUploadToken(liveId).then((token) => {
          return this.uploadService.uploadToQiniu(originMessage.image.imageData, token.key, token.token);
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        }).then((key) => {
          postMessage.image.key = key;
          return this.http.post(url, JSON.stringify(postMessage), {headers: headers}).toPromise();
        }, (err) => {
          originMessage.postStatus = PostMessageStatus.UploadFailed;
          return Promise.reject(err);
        });
      }

      promise.then(res => {
        let data = res.json();

        originMessage.postStatus = PostMessageStatus.PostSuccessful;
        originMessage.id = data.id;

        this.timelineService.deleteMessage(originMessage);
        this.timelineService.pushMessage(originMessage);
      }, () => {
        originMessage.postStatus = PostMessageStatus.PostFailed;
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

        if (message instanceof MessageModel) {
          this.timelineService.deleteMessage(message);
          this.timelineService.pushMessage(message);
        }
      }, (err) => {
        message.postStatus = PostMessageStatus.PostFailed;
      });
    }
  }

  getImageUploadToken(liveId: string): Promise<UploadTokenModel> {
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/image/uptoken`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();

      let uploadTokenModel = new UploadTokenModel(data.token, data.key);

      return uploadTokenModel;
    });
  }

  getAudioUploadToken(liveId: string): Promise<UploadTokenModel> {
    const url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/audio/uptoken`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();

      let uploadTokenModel = new UploadTokenModel(data.token, data.key);

      return uploadTokenModel;
    });
  }

  filterMessage(messages: MessageModel[]): MessageModel[] {
    for (let index in messages) {
      let message = messages[index];
      if (!message.isText() && !message.isAudio() && !message.isImage() && !message.isNice()) {
        messages.splice(+index, 1);
      }
    }

    return messages;
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

  history(liveId: string, needRefresh = false): Promise<MessageModel[]> {
    if (!needRefresh) {
      let historyMessage = StoreService.get('historyMessage');
      if (historyMessage && historyMessage[liveId]) {
        return Promise.resolve(historyMessage[liveId]);
      }
    }

    let url = `${environment.config.host.io}/api/live/posts/${liveId}/messages`;

    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let messages: MessageModel[] = [];

      if (data && data.result) {
        for (let messageData of data.result) {
          let message = this.parseMessage(messageData, data.include.users);
          messages.push(message);
        }
      }

      messages = this.filterMessage(messages);
      messages = this.rerangeHistoryMessage(messages);

      let historyMessage = StoreService.get('historyMessage') || {};
      historyMessage[liveId] = messages;
      StoreService.set('historyMessage', historyMessage);

      return messages;
    });
  }

  praise(liveId: string, msgId: string, praised: boolean, num: number): Promise<void> {
    let data = new PostPraiseModel();
    data.praised = praised;
    data.num = num;

    var target = new TargetInfo()
    target.targetId = msgId
    target.targetType = ObjectType.message
    this.analytics.eventPraise(target)

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

  postInputtingMessage(liveId: string, type: string) {
    let url = `${environment.config.host.io}/api/live/streams/${liveId}/messages/inputting`;
    let body = {type: type};
    this.http.post(url, JSON.stringify(body)).toPromise();
  }

  deleteHistoryMessage(liveId: string, messageId: string): Promise<void> {
    let url = `${environment.config.host.io}/api/live/posts/${liveId}/messages/${messageId}`;

    return this.http.delete(url, null).toPromise().then(res => {
      return;
    });
  }

  editHistoryMessage(liveId: string, messageId: string, content: string, weixinId?: string, imagesKey?: string): Promise<void> {
    let url = `${environment.config.host.io}/api/live/posts/${liveId}/messages/${messageId}`;
    let data = {
      content: content,
    };

    if (weixinId || imagesKey) {
      data['image'] = {
        weixinId: weixinId,
        imagesKey: imagesKey,
      };
    }

    return this.http.put(url, data).toPromise().then(res => {
      return;
    });
  }

  getHistoryMessageUpToken(liveId: string, messageId: string): Promise<UploadTokenModel> {
    let url = `${environment.config.host.io}/api/live/posts/${liveId}/messages/${messageId}/image/uptoken`;
    return this.http.post(url, null).toPromise().then(res => {
      let data = res.json();
      return new UploadTokenModel(data.token, data.key);
    });
  }
}
