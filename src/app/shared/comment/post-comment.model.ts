export class PostCommentImageModel {
  link: string;
}

export class PostCommentAudioModel {
  link: string;
  text: string;
  weixinId: string;
}

export class PostCommentNiceModel {
  uid: number;
  commentId: string;
  message: string;
}

export class PostCommentModel {
  type: string;
  content: string;
  parentId: string;
  audio: PostCommentAudioModel;
  image: PostCommentImageModel;
  nice: PostCommentNiceModel;
}
