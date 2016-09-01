export class PostCommentNiceModel {
  uid: number;
  message: string;
}

export class PostCommentImageModel {
  link: string;
}

export class PostCommentAudioModel {
  link: string;
  text: string;
  weixinId: string;
}

export class PostCommentModel {
  type: string;
  content: string;
  audio: PostAudioCommentModel;
  image: PostCommentImageModel;
  nice: PostCommentNiceModel;
}
