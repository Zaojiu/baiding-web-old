import {MessageType, PostMessageStatus} from './message.enum';
import {UserInfoModel} from '../user-info/user-info.model'
import {UserAnimEmoji} from '../../praised-animation/praised-animation.model'

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
  imageData: File;
  link: string;
  thumbLink: string;
  smallLink: string;
}

export class MessageModel {
  id: string;
  parentId: string;
  isReceived: boolean; // 用于判断是否为服务器拉取下来的信息，或者是本地发送时的信息。
  user: UserInfoModel;
  content: string;
  type: MessageType;
  audio: AudioMessageModel;
  image: ImageMessageModel;
  hadPraised: boolean = false;
  praisedAmount: number = 0;
  praisedAnimations: UserAnimEmoji[] = [];
  praisedAvatars: UserInfoModel[] = [];
  replies: ReplyMessageModel[] = [];
  createdAt: string;
  postStatus = PostMessageStatus.PostSuccessful;

  getPraisedAvatars(currentUser: UserInfoModel) {
    let avatars = this.praisedAvatars.filter((item, index) => item.uid != currentUser.uid);

    if (this.hadPraised) {
      avatars = avatars.slice(0, 4);
      avatars.push(currentUser);
    } else {
      avatars = avatars.slice(0, 5);
    }

    return avatars
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
  num: number
}

export class PostImageMessageModel {
  imageData: File;
  key: string;
}

export class PostAudioMessageModel {
  text: string;
  weixinId: string;
  localId: string;
  audioData: Blob;
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
  originMessage: MessageModel|ReplyMessageModel;
}

export class UploadTokenModel {
  token: string;
  key: string;

  constructor(token: string, key: string) {
    this.token = token;
    this.key = key;
  }
}
