import {LiveStatus, LiveType, LiveStreamStatus} from './live.enums';
import {UserInfoModel} from '../user-info/user-info.model';
import {UserAnimEmoji} from '../../praised-animation/praised-animation.model';

export class LiveInfoModel {
  id: string;
  subject: string;
  desc: string;
  coverUrl: string;
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  kind: LiveType;
  status: LiveStatus;
  isDraft: boolean;
  owner: UserInfoModel;
  admin: UserInfoModel;
  editors: UserInfoModel[]; //后端新增字段 avatar_url,title //TODO
  latestUsers: UserInfoModel[]; // 话题间观众
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
  booked: boolean;
  streamStatus: LiveStreamStatus = LiveStreamStatus.None;
  isNeedPay: boolean; // 是否收费，默认免费
  totalFee: number; // 价格，单位“分”
  paid: boolean; //付费情况

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

  isVip(uid: number): boolean {
    let isVip = false;

    for (let editor of this.editors) {
      if (editor.uid === uid) {
        isVip = true;
        break;
      }
    }

    return isVip;
  }

  isEditor(uid: number): boolean {
    return this.isAdmin(uid) || this.isVip(uid);
  }

  isAudience(uid: number): boolean {
    return !this.isEditor(uid);
  }

  isTypeText(): boolean {
    return this.kind === LiveType.Text;
  }

  isTypeVideo(): boolean {
    return this.kind === LiveType.Video;
  }

  isTypeApp(): boolean {
    return this.kind === LiveType.App;
  }

  isStreamNone(): boolean {
    return this.streamStatus === LiveStreamStatus.None;
  }

  isStreamPushing(): boolean {
    return this.streamStatus === LiveStreamStatus.Pushing;
  }

  isStreamDone(): boolean {
    return this.streamStatus === LiveStreamStatus.Done;
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
