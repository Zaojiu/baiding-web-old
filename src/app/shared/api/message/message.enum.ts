export enum MessageType {
  Text = 0,
  Image,
  Audio,
  Nice,
  EditorJoin,
  LiveStart,
  LiveEnd,
  LiveRoomInfo,
}

export enum PostMessageStatus {
  Pending = 0,
  PostSuccessful,
  PostFailed,
  UploadFailed,
  TranslateFailed,
}
