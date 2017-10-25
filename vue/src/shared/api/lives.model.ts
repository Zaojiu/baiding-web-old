import {UserInfoModel} from "./user.model";
import {Money} from "../utils/utils";

export enum LiveStatus {
  Null = 0,
  Created,
  Canceled,
  Started,
  Ended
}

export enum LiveType {
  Text = <any>'text',
  Video = <any>'video',
  App = <any>'app',
}

export enum LiveStreamStatus {
  None = <any>'',
  Pushing = <any>'publish',
  Done = <any>'publish_done',
}

export enum LivePublishedStatus {
  Published = 1,
  Draft
}

export enum LivePayType {
  Purchase = 0,
  Present,
}

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
  editors: UserInfoModel[];
  invitedEditors: UserInfoModel[];
  latestUsers: UserInfoModel[]; // 话题间观众

  praised: number;
  commented: number;
  niced: number;
  shared: number;
  invited: number;
  booked: boolean;
  hadPraised: boolean;

  praisedAnimations: UserAnimEmoji[] = [];
  totalUsers: number; //  参与人数

  streamStatus: LiveStreamStatus = LiveStreamStatus.None;

  isNeedPay: boolean; // 是否收费，默认免费
  totalFee: Money; // 价格，单位“分”
  memberFee: Money; // 会员价，单位“分”
  originFee: Money;
  paid: boolean; //付费情况
  paidType: LivePayType;

  alertMessage: string;

  expectStartAt: string;
  expectStartAtParsed: Moment;
  expectDuration: number;
  expectDurationParsed: Duration;
  startedAt: string;
  startedAtParsed: Moment;
  closedAt: string;
  closedAtParsed: Moment;
  updatedAt: string;
  updatedAtParsed: Moment;
  createdAt: string;
  createdAtParsed: Moment;

  constructor(data: any, users: any, currentStreamUser?: any) {
    this.id = data.id;
    this.subject = data.subject;
    this.desc = data.desc;

    switch (data.meta.kind) {
      case 'text':
        this.kind = LiveType.Text;
        break;
      case 'video':
        this.kind = LiveType.Video;
        break;
      case 'app':
        this.kind = LiveType.App;
        break;
      default:
        this.kind = LiveType.Text;
    }

    this.owner = users[data.uid] as UserInfoModel;
    this.admin = users[data.meta.admin] as UserInfoModel;

    this.editors = [];
    if (data.meta.editors) {
      data.meta.editors.forEach((uid: number) => {
        let user = users[uid];
        if (user) {
          this.editors.push(user);
        }
      });
    }

    this.invitedEditors = [];
    if (data.meta.invitedEditors) {
      this.invitedEditors = data.meta.invitedEditors;
    }

    this.latestUsers = [];
    if (data.latestUserUids) {
      data.latestUserUids.forEach((uid: number) => {
        let user = users[uid];
        if (user) {
          this.latestUsers.push(user);
        }
      });
    }

    this.expectStartAt = data.meta.expectStartAt;
    this.expectDuration = data.meta.expectDuration;
    this.startedAt = data.meta.startedAt;
    this.closedAt = data.meta.closedAt;
    this.createdAt = (+data.createdAt / 1e6).toString();
    this.updatedAt = (+data.updatedAt / 1e6).toString();
    this.isDraft = data.isDraft;

    const coverUrl = data.coverUrl;
    this.coverUrl = coverUrl ? encodeURI(coverUrl) : '/assets/img/default-cover.jpg';
    this.coverSmallUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';

    this.cover169Url = coverUrl ? encodeURI(`${coverUrl}~16-9`) : '/assets/img/default-cover.jpg';
    this.coverSmall169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';

    this.cover11Url = coverUrl ? encodeURI(`${coverUrl}~1-1`) : '/assets/img/default-cover.jpg';
    this.coverSmall11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';

    if (data.meta.status === 'created') this.status = LiveStatus.Created;
    if (data.meta.status === 'canceled') this.status = LiveStatus.Canceled;
    if (data.meta.status === 'started') this.status = LiveStatus.Started;
    if (data.meta.status === 'closed') this.status = LiveStatus.Ended;

    this.praised = data.praised;
    this.isNeedPay = data.isNeedPay;
    this.totalFee = new Money(data.totalFee || 0);
    this.memberFee = new Money(data.memberFee || 0);
    this.originFee = new Money(data.originFee || 0);
    this.commented = data.commented;
    this.niced = data.niced;
    this.shared = data.shared;
    this.hadPraised = currentStreamUser && currentStreamUser.praised;
    this.booked = currentStreamUser && currentStreamUser.booked;
    this.paid = currentStreamUser && currentStreamUser.paid;
    this.paidType = currentStreamUser && currentStreamUser.paidType;
    this.invited = currentStreamUser && currentStreamUser.invited;
    this.totalUsers = data.totalUsers;
    this.alertMessage = data.meta.alertMessage || '';

    if (this.kind === LiveType.Video) {
      switch (data.meta.publishStatus) {
        case '':
          this.streamStatus = LiveStreamStatus.None;
          break;
        case 'publish':
          this.streamStatus = LiveStreamStatus.Pushing;
          break;
        case 'publish_done':
          this.streamStatus = LiveStreamStatus.Done;
          break;
        default:
          this.streamStatus = LiveStreamStatus.None;
      }
    }
  }

  get isPayByPresent() {
    return this.paidType === LivePayType.Present;
  }

  get isCreated(): boolean {
    return this.status == LiveStatus.Created;
  }

  get isStarted(): boolean {
    return this.status == LiveStatus.Started;
  }

  get isClosed(): boolean {
    return this.status == LiveStatus.Ended;
  }

  get isTypeText(): boolean {
    return this.kind === LiveType.Text;
  }

  get isTypeVideo(): boolean {
    return this.kind === LiveType.Video;
  }

  get isTypeApp(): boolean {
    return this.kind === LiveType.App;
  }

  get isStreamNone(): boolean {
    return this.streamStatus === LiveStreamStatus.None;
  }

  get isStreamPushing(): boolean {
    return this.streamStatus === LiveStreamStatus.Pushing;
  }

  get isStreamDone(): boolean {
    return this.streamStatus === LiveStreamStatus.Done;
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
}

export class UserAnimEmoji {
  user: UserInfoModel;
  emoji: string;
}

export class ShareRankingModel {
  id: string;
  uid: number;
  invited: number;
  avatar: string;
  username: string;
  nick: string;

  constructor(data: any) {
    this.id = data.id;
    this.uid = data.uid;
    this.invited = data.invited;
    this.avatar = data.avatar;
    this.username = data.username;
    this.nick = data.nick;
  }
}

export class LiveRoomPresentModel {
  totalPresent: number;
  leftPresent: number;
  from: number;
  takenUsers: UserInfoModel[] = [];

  constructor(data: any) {
    if (!data) return;

    this.totalPresent = data.totalPresent;
    this.leftPresent = data.leftPresent;
    this.from = data.from;
    this.takenUsers = [];

    const userData = data.users || {};

    if (data.takenUsers && data.takenUsers.length) {
      data.takenUsers.forEach((takenData: any) => {
        const takenUser = userData[takenData.to];
        if (takenUser) {
          const takenUserInfo = new UserInfoModel(takenUser);
          this.takenUsers.push(takenUserInfo);
        }
      });
    }
  }
}
