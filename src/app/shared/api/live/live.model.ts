import {LiveStatus, LiveType, LiveStreamStatus, LivePayType} from './live.enums';
import {UserInfoModel} from '../user-info/user-info.model';
import {UserAnimEmoji} from '../../praised-animation/praised-animation.model';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Money} from "../../utils/utils";

export class LiveInfoModel {
  id: string;
  subject: string;
  desc: string;
  coverUrl: string;
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  cover169Url: string;
  coverSmall169Url: string;
  coverThumbnail169Url: string;
  cover11Url: string;
  coverSmall11Url: string;
  coverThumbnail11Url: string;
  kind: LiveType;
  status: LiveStatus;
  isDraft: boolean;
  owner: UserInfoModel;
  admin: UserInfoModel;
  editors: UserInfoModel[]; //后端新增字段 avatar_url,title //TODO
  invitees: LiveInviteeInfoModel[];
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
  totalFee: Money; // 价格，单位“分”
  memberFee: Money; // 会员价，单位“分”
  originFee: Money;
  paid: boolean; //付费情况
  paidType: LivePayType;
  invited: number;
  alertMessage: string;
  themeCss: string;
  disableComment: boolean;

  isPayByPresent() {
    return this.paidType === LivePayType.Present;
  }

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

export class ShareRankingModel {
  id: string;
  uid: number;
  invited: number;
  avatar: SafeUrl;
  username: string;
  nick: string;

  constructor(data: any, sanitizer: DomSanitizer) {
    this.id = data.id;
    this.uid = data.uid;
    this.invited = data.invited;
    this.avatar = sanitizer.bypassSecurityTrustUrl(data.avatar);
    this.username = data.username;
    this.nick = data.nick;
  }
}

export class LiveRoomPresentModel {
  totalPresent: number;
  leftPresent: number;
  from: number;
  takenUsers: UserInfoModel[];

  constructor(data: any) {
    if (data) {
      this.totalPresent = data.totalPresent;
      this.leftPresent = data.leftPresent;
      this.from = data.from;
      this.takenUsers = [];

      const userData = data.users || {};
      if (data.takenUsers && data.takenUsers.length) {
        data.takenUsers.forEach(takenData => {
          const takenUid = takenData.to;
          const takenUser = userData[takenUid];
          if (takenUser) {
            const takenUserInfo = new UserInfoModel();
            takenUserInfo.uid = takenUser.uid;
            takenUserInfo.avatar = takenUser.avatar;
            takenUserInfo.username = takenUser.username;
            takenUserInfo.nick = takenUser.nick;
            this.takenUsers.push(takenUserInfo);
          }
        });
      }
    }
  }
}

export class LiveInviteeInfoModel {
  id: string;
  name: string;
  desc: string;
  title: string;
  avatar: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.title = data.title;
    this.avatar = data.avatar_url;
    this.desc = data.desc;
  }
}

