import {MessageType, PostMessageStatus} from './message.enum';
import {UserInfoModel} from '../user-info/user-info.model'
import {UserAnimEmoji} from '../../praised-animation/praised-animation.model'
import {SafeHtml} from "@angular/platform-browser";

export class AudioMessageModel {
  audioData: Blob;
  localId: string;
  serverId: string;
  translateResult = '';
  link: string;
  duration: number;
}

export class ReplyMessageModel {
  id: string;
  parentId: string;
  user: UserInfoModel;
  content: string;
  createdAt: string;
  postStatus = PostMessageStatus.PostSuccessful;
}

export class ImageMessageModel {
  localId: string;
  imageData: File;
  link: string;
  thumbLink: string;
  smallLink: string;
}

export class MessageModel {
  id: string;
  parentId: string;
  parentMessage: MessageModel;
  isReceived: boolean; // 用于判断是否为服务器拉取下来的信息，或者是本地发送时的信息。
  user: UserInfoModel;
  content: string;
  contentParsed: SafeHtml;
  type: MessageType;
  audio: AudioMessageModel;
  image: ImageMessageModel;
  hadPraised: boolean = false;
  praisedAmount: number = 0;
  praisedAnimations: UserAnimEmoji[] = [];
  praisedAvatars: UserInfoModel[] = [];
  replies: ReplyMessageModel[] = [];
  createdAt: string;
  createdAtParsed: Moment;
  postStatus = PostMessageStatus.PostSuccessful;

  isMine(myUid): boolean {
    return this.user.uid === myUid;
  }

  isText(): boolean {
    return this.type === MessageType.Text;
  }

  isAudio(): boolean {
    return this.type === MessageType.Audio;
  }

  isImage(): boolean {
    return this.type === MessageType.Image;
  }

  isNice(): boolean {
    return this.type === MessageType.Nice;
  }

  isLiveInfo(): boolean {
    return this.type === MessageType.LiveRoomInfo;
  }

  isLiveStarted(): boolean {
    return this.type === MessageType.LiveStart;
  }

  isLiveEnded(): boolean {
    return this.type === MessageType.LiveEnd;
  }

  isEditorJoin(): boolean {
    return this.type === MessageType.EditorJoin;
  }

  isReply(): boolean {
    return !!this.parentId;
  }

  isPostPending(): boolean {
    return this.postStatus === PostMessageStatus.Pending;
  }

  isPostFailed(): boolean {
    return this.postStatus === PostMessageStatus.PostFailed;
  }

  isPostSuccessful(): boolean {
    return this.postStatus === PostMessageStatus.PostSuccessful;
  }

  isUploadFailed(): boolean {
    return this.postStatus === PostMessageStatus.UploadFailed;
  }

  getPraisedAvatars(currentUser: UserInfoModel) {
    if (!currentUser) {
      return [];
    }
    let avatars = this.praisedAvatars.filter((item, index) => {
      return item && item.uid !== currentUser.uid;
    });
    if (this.hadPraised) {
      avatars = avatars.slice(0, 4);
      avatars.push(currentUser);
    } else {
      avatars = avatars.slice(0, 5);
    }

    return avatars;
  }

    pushPraisedUser(userAnim: UserAnimEmoji, praised: boolean, num: number) {
    if (!praised) {
      this.praisedAmount += 1;
      this.praisedAvatars.unshift(userAnim.user);

      if (this.praisedAvatars.length > 5) {
        this.praisedAvatars.pop();
      }
    }

    if (num > 10) {
      num = 10;
    }

    while (num > 0) {
      num -= 1;

      setTimeout(() => {
        this.praisedAnimations.push(userAnim);
      }, _.random(1, 10) * 150);
    }
  }
}

export class PostPraiseModel {
  praised: boolean;
  num: number;
}

export class PostImageMessageModel {
  weixinId: string;
  key: string;
}

export class PostAudioMessageModel {
  text: string;
  weixinId: string;
  qiniuKey: string; // 使用ios或者web的普通录音, 上传七牛完成后, 得到的key
  duration: number;
}

export class PostNiceMessageModel {
  uid: number;
  commentId: string;
  message: string;
}

export class PostMessageModel {
  liveId: string;
  type: string;
  content: string;
  parentId: string;
  audio: PostAudioMessageModel;
  image: PostImageMessageModel;
  nice: PostNiceMessageModel;
  originMessage: MessageModel | ReplyMessageModel;
}

export class UploadTokenModel {
  token: string;
  key: string;

  constructor(token: string, key: string) {
    this.token = token;
    this.key = key;
  }
}

export class InputtingMessageModel {
  id: string;
  type: string;
  user: UserInfoModel;
}
