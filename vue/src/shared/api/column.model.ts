import {SpeakerModel} from "./speaker.model";
import {Money} from "../utils/utils";
import {PayType} from "./pay.enum";
import {UserInfoModel} from "./user.model";

export class ColumnUserInfo {
  paid: boolean;
  paidAt: string;
  paidAtParsed: Moment;
  payType: PayType;
  praised: boolean;
  praisedAt: Moment;
  praisedAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    this.paid = data.isPaid;
    this.paidAt = data.paidAt;
    this.paidAtParsed = moment(data.paidAt);
    this.payType = data.payType;
    this.praised = !moment(data.praisedAt).isZero();
    this.praisedAt = data.praisedAt;
    this.praisedAtParsed = moment(data.praisedAt);
  }
}

export enum ColumnStatus {
  Unpublish = 0,
  Publish,
}

export class Column {
  id: string;
  coverUrl: string;
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  cover169Url: string;
  coverSmall169Url: string;
  coverThumbnail169Url: string;
  cover11Url: string;
  coverSmall11Url: string;
  coverThumbnail11Url: string;
  speaker: SpeakerModel;
  subject: string;
  desc: string;
  content: string;
  totalFee: Money; // 价格，单位“分”
  memberFee: Money; // 会员价，单位“分”
  originFee: Money; // 原价，单位分
  isNeedPay: boolean;
  subscribedTotal: number;
  totalVol: number;
  currentVol: number;
  status: ColumnStatus;
  publishAt: string;
  publishAtParsed: Moment;
  createdAt: string;
  createdAtParsed: Moment;
  updatedAt: string;
  updatedAtParsed: Moment;
  currentUserInfo: ColumnUserInfo;

  constructor(data: any, currentUserInfo?: any) {
    if (!data) return;

    const coverUrl = data.coverUrl;

    this.id = data.id;
    this.coverUrl = coverUrl ? encodeURI(coverUrl) : '/assets/img/default-cover.jpg';
    this.coverSmallUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover169Url = coverUrl ? encodeURI(`${coverUrl}~16-9`) : '/assets/img/default-cover.jpg';
    this.coverSmall169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover11Url = coverUrl ? encodeURI(`${coverUrl}~1-1`) : '/assets/img/default-cover.jpg';
    this.coverSmall11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.speaker = new SpeakerModel(data.speaker);
    this.subject = data.subject;
    this.desc = data.desc;
    this.content = data.content;
    this.totalFee = new Money(data.totalFee);
    this.memberFee = new Money(data.memberFee);
    this.originFee = new Money(data.originFee);
    this.isNeedPay = data.isNeedPay;
    this.subscribedTotal = data.subscribedTotal;
    this.totalVol = data.totalVol;
    this.currentVol = data.currentVol;
    this.status = data.status;
    this.publishAt = data.publishAt;
    this.publishAtParsed = moment(data.publishAt);
    this.createdAt = data.createdAt;
    this.createdAtParsed = moment(data.createdAt);
    this.updatedAt = data.updatedAt;
    this.updatedAtParsed = moment(data.updatedAt);
    this.currentUserInfo = currentUserInfo ? new ColumnUserInfo(currentUserInfo) : new ColumnUserInfo({});
  }

  get paid(): boolean {
    return !this.isNeedPay || (!!this.currentUserInfo && this.currentUserInfo.paid);
  }
}

export enum ColumnItemType {
  Post = 1, // 文章
  Audio, // 音频
  Video, // 视频
}

export enum ColumnItemPayType {
  Single = 1, //单品售卖
  InColumn, //专栏内售卖
  Free, //免费
}

export enum ColumnItemStatus {
  Ready = 1, //上架
  Draft, //草稿
  NotReady, // 内容未上架
}

export class ColumnItem {
  id: string;
  columnId: string;
  vol: number;
  type: ColumnItemType;
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
  duration: Duration;
  totalFee: Money; // 价格，单位“分”
  memberFee: Money; // 会员价，单位“分”
  originFee: Money; // 原价，单位分
  payType: ColumnItemPayType;
  status: ColumnItemStatus;
  viewTotal: number;
  commentTotal: number;
  praisedTotal: number;
  publishAt: string;
  publishAtParsed: Moment;
  createdAt: string;
  createdAtParsed: Moment;
  updatedAt: string;
  updatedAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    const coverUrl = data.coverUrl;

    this.id = data.id;
    this.columnId = data.columnId;
    this.vol = data.vol;
    this.type = data.type;
    this.subject = data.subject;
    this.desc = data.desc;
    this.coverUrl = coverUrl ? encodeURI(coverUrl) : '/assets/img/default-cover.jpg';
    this.coverSmallUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover169Url = coverUrl ? encodeURI(`${coverUrl}~16-9`) : '/assets/img/default-cover.jpg';
    this.coverSmall169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover11Url = coverUrl ? encodeURI(`${coverUrl}~1-1`) : '/assets/img/default-cover.jpg';
    this.coverSmall11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.duration = moment.duration(data.duration);
    this.totalFee = new Money(data.totalFee);
    this.memberFee = new Money(data.memberFee);
    this.originFee = new Money(data.originFee);
    this.payType = data.payType;
    this.status = data.status;
    this.viewTotal = data.viewTotal;
    this.commentTotal = data.commentTotal;
    this.praisedTotal = data.praisedTotal;
    this.publishAt = data.publishAt;
    this.publishAtParsed = moment(data.publishAt);
    this.createdAt = data.createdAt;
    this.createdAtParsed = moment(data.createdAt);
    this.updatedAt = data.updatedAt;
    this.updatedAtParsed = moment(data.updatedAt);
  }

  get isTypePost(): boolean {
    return this.type === ColumnItemType.Post;
  }

  get isTypeVideo(): boolean {
    return this.type === ColumnItemType.Video;
  }

  get isTypeAudio(): boolean {
    return this.type === ColumnItemType.Audio;
  }

  get isStatusNotReady(): boolean {
    return this.status === ColumnItemStatus.NotReady;
  }

  get isStatusReady(): boolean {
    return this.status === ColumnItemStatus.Ready;
  }

  get isPayTypeColumn(): boolean {
    return this.payType === ColumnItemPayType.InColumn;
  }

  get isPayTypeSingle(): boolean {
    return this.payType === ColumnItemPayType.Single;
  }

  get isPayTypeFree(): boolean {
    return this.payType === ColumnItemPayType.Free;
  }

  get paid(): boolean {
    // return this.isPayTypeSingle && (this.currentUserInfo && this.currentUserInfo.paid);
    // TODO: single paid
    return true;
  }
}

export class ColumnItemUserInfo {
  paid: boolean;
  paidAt: string;
  paidAtParsed: Moment;
  praised: boolean;
  praisedAt: Moment;
  praisedAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    this.paid = data.isPaid;
    this.paidAt = data.paidAt;
    this.paidAtParsed = moment(data.paidAt);
    this.praised = !moment(data.praisedAt).isZero();
    this.praisedAt = data.praisedAt;
    this.praisedAtParsed = moment.unix(data.praisedAt);
  }
}

export class ColumnItemContent extends ColumnItem {
  content: string;
  audioUrl: string;
  videoUrl: string;
  currentUserInfo: ColumnItemUserInfo;

  constructor(data: any, currentUserInfo?: any) {
    if (!data) return;

    super(data);

    this.content = data.content;
    this.audioUrl = data.audioUrl;
    this.videoUrl = data.videoUrl;
    this.currentUserInfo = currentUserInfo ? new ColumnItemUserInfo(currentUserInfo) : new ColumnItemUserInfo({});
  }
}

export class ColumnItemDetail {
  column: Column;
  current: ColumnItemContent;
  prev: ColumnItemContent | null;
  next: ColumnItemContent | null;

  constructor(data: any) {
    if (!data) return;

    this.column = new Column(data.column, data.column_user_info);
    this.prev = data.pre ? new ColumnItemContent(data.pre) : null;
    this.next = data.next ? new ColumnItemContent(data.next) : null;
    this.current = new ColumnItemContent(data.item, data.item_user_info);
  }
}

export class ColumnItemCommentParentModel {
  user: UserInfoModel;
  content: string;
  createdAtParsed: Moment;

  constructor(userInfo: UserInfoModel, content: string, createdAtParsed: Moment) {
    this.user = userInfo;
    this.content = content;
    this.createdAtParsed = createdAtParsed;
  }
}

export class ColumnItemCommentModel {
  id: string;
  user: UserInfoModel;
  parent: ColumnItemCommentParentModel;
  toUsers: UserInfoModel[] = [];
  content: string;
  createdAtParsed: Moment;
  createdAt: string;

  constructor(data: any, users: any) {
    this.id = data.id;
    if (users) this.user = users[data.uid];
    if (data.parent && users) {
      this.parent = new ColumnItemCommentParentModel(users[data.parent.uid], data.parent.content, moment(+data.parent.createdAt / 1e6));
    }
    if (data.toUids) {
      for (let uid of data.toUsers) {
        this.toUsers.push(users[uid]);
      }
    }
    this.content = data.content;
    this.createdAtParsed = moment(data.createdAt);
    this.createdAt = data.createdAt;
  }
}
