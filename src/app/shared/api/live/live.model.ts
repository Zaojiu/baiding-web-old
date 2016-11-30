import {LiveStatus} from './live.enums';
import {UserInfoModel} from '../user-info/user-info.model';
import {UserAnimEmoji} from '../../praised-animation/praised-animation.model';

export class LiveInfoModel {
  id: string;
  subject: string;
  desc: string;
  coverUrl: string;
  coverSmallUrl: string;
  kind: string;
  status: LiveStatus;
  isDraft: boolean;
  owner: UserInfoModel;
  admin: UserInfoModel;
  editors: UserInfoModel[];
  latestUsers: UserInfoModel[]; // 最近访问的用户
  audienceList: UserInfoModel[]; // 直播间观众
  praised: number;
  commented: number;
  niced: number;
  shared: number;
  lcConvId: string;
  hadPraised: boolean;
  praisedAnimations: UserAnimEmoji[] = [];
  expectStartAt: string;
  expectDuration: number;
  startedAt: string;
  closedAt: string;
  createdAt: string;
  updatedAt: string;
  totalUsers: number; //  参与人数

  isCreated(): boolean {
    return this.status == LiveStatus.Created;
  }

  isStarted(): boolean {
    return this.status == LiveStatus.Started;
  }

  isClosed(): boolean {
    return this.status == LiveStatus.Ended;
  }

  isAdmin(uid: number): boolean {
    return this.admin.uid === uid;
  }

  isEditor(uid: number): boolean {
    let isEditor = false;

    for (let editor of this.editors) {
      if (editor.uid === uid) {
        isEditor = true;
        break;
      }
    }
    return isEditor;
  }

  isAudience(uid: number) {
    return !this.isAdmin(uid) && !this.isEditor(uid);
  }
}

export class UploadCoverTokenModel {
  coverKey: string;
  token: string;

  constructor(coverKey: string, token: string) {
    this.coverKey = coverKey;
    this.token = token;
  }
}

