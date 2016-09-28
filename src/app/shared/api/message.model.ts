export class PostImageMessageModel {
  key: string;
}

export class PostAudioMessageModel {
  link: string;
  text: string;
  weixinId: string;
}

export class PostNiceMessageModel {
  uid: number;
  commentId: string;
  message: string;
}

export class PostMessageModel {
  type: string;
  content: string;
  parentId: string;
  audio: PostAudioMessageModel;
  image: PostImageMessageModel;
  nice: PostNiceMessageModel;
}
