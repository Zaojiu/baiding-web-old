import { UserInfoModel } from '../user-info/user-info.model'
import {SafeHtml} from "@angular/platform-browser";

export class PostCommentModel {
  content: string;
  toUids: number[];
}

export enum CommentType {
  Text = 0,
  AudienceJoined,
  CommentPushed
}

export class CommentModel {
  id: string;
  user: UserInfoModel;
  content: string;
  parsedContent: SafeHtml;
  type: CommentType;
  eventData: any = null;
  msgId: string;
  createdAt: string;
  toUsers: UserInfoModel[] = [];
  toUids: number[] = [];
  isAtMe = false;
}
