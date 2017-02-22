import {LiveStatus, LiveType} from '../live/live.enums';
import {UserInfoModel} from '../user-info/user-info.model';

export class TalkInfoRefModel {
  link: string;
  title: string;

  constructor(link: string, title: string) {
    this.link = link;
    this.title = title;
  }
}

export class TalkInfoModel {
  id: string;
  userInfo: UserInfoModel;
  subject: string;
  desc: string;
  coverUrl: string;
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  type: LiveType;
  status: LiveStatus;
  commentTotal: number;
  praiseTotal: number;
  isNeedPay: boolean;
  totalFee: number;
  praised: number;
  commented: number;
  shared: number;
  totalUsers: number;
  latestPraisedUsers: UserInfoModel[];
  latestUsers: UserInfoModel[];

  content: string;
  isOriginal: boolean;
  refInfo: TalkInfoRefModel;

  publishAt: Moment;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(data: any, users: any) {
    this.id = data.id;
    this.userInfo = users[data.uid] as UserInfoModel;
    this.subject = data.subject;
    this.desc = data.desc;
    this.coverUrl = `${data.coverUrl}?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmallUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x/gravity/Center/crop/640x300&updatedAt=${Math.round(+data.updatedAt)}` : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/60x/gravity/Center/crop/60x&updatedAt=${Math.round(+data.updatedAt)}` : '/assets/img/default-cover.jpg';

    switch (data.type) {
      case 'text':
        this.type = LiveType.Text;
        break;
      case 'video':
        this.type = LiveType.Video;
        break;
      case 'app':
        this.type = LiveType.App;
        break;
      default:
        this.type = LiveType.Text;
    }

    switch (data.status) {
      case 'created':
        this.status = LiveStatus.Created;
        break;
      case 'canceled':
        this.status = LiveStatus.Canceled;
        break;
      case 'started':
        this.status = LiveStatus.Started;
        break;
      case 'closed':
        this.status = LiveStatus.Ended;
        break;
      default:
        this.status = LiveStatus.Null;
    }

    this.commentTotal = data.commentTotal;
    this.praiseTotal = data.praiseTotal;

    this.isNeedPay = data.isNeedPay;
    this.totalFee = data.totalFee;
    this.praised = data.praised;
    this.commented = data.commented;
    this.shared = data.shared;
    this.totalUsers = data.totalUsers;

    this.latestPraisedUsers = [];
    if (data.latestPraisedUids) {
      data.latestPraisedUids.forEach(function (uid) {
        let user = users[uid];
        if (user) this.latestPraisedUsers.push(user);
      });
    }

    this.latestUsers = [];
    if (data.latestUserUids) {
      data.latestUserUids.forEach(function (uid) {
        let user = users[uid];
        if (user) this.latestUsers.push(user);
      });
    }

    this.content = data.meta && data.meta.content ? data.meta.content : '';
    this.isOriginal = data.meta && data.meta.isOriginal ? data.meta.isOriginal : false;
    this.refInfo = data.meta && data.meta.refInfo ? new TalkInfoRefModel(data.meta.refInfo.link, data.meta.refInfo.title) : null;

    this.createdAt = moment(+data.createdAt / 1e6);
    this.updatedAt = moment(+data.updatedAt / 1e6);
    this.publishAt = moment(+data.publishAt / 1e6);
  }
}
