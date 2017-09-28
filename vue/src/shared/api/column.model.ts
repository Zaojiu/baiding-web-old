import {SpeakerModel} from "./speaker.model";
import {Money} from "../utils/utils";

export class ColumnUserInfo {
  paid: boolean;
  paidAt: string;
  paidAtParsed: Moment;
  praised: boolean;
  shared: boolean;

  constructor(data: any) {
    if (!data) return;

    this.paid = data.paid;
    this.paidAt = data.paidAt;
    this.paidAtParsed = moment(data.paidAt);
    this.praised = data.praised;
    this.shared = data.shared;
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
  currentUserInfo: ColumnUserInfo | null;

  constructor(data: any) {
    if (!data) return;

    this.id = data.id;

    this.coverUrl = data.coverUrl;
    this.coverSmallUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnailUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;
    this.cover169Url = `${data.coverUrl}~16-9`;
    this.coverSmall169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnail169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;
    this.cover11Url = `${data.coverUrl}~1-1`;
    this.coverSmall11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnail11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;

    this.speaker = new SpeakerModel(data.speaker);
    this.subject =  data.subject;
    this.desc =  data.desc;
    this.content =  data.detail;
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
    this.currentUserInfo = data.current_user_info ? new ColumnUserInfo(data.current_user_info) : null;
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
  Draft = 0, //草稿
  NotReady, //内容还不能访问，但是会在列表中灰色显示
  Ready, //上架
}

export class ColumnItem {
  id: string;
  columnId: string;
  vol: number;
  type: ColumnItemType;
  subject: string;
  desc: string;
  coverUrl: string;
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

    this.id = data.id;
    this.columnId = data.columnId;
    this.vol = data.vol;
    this.type = data.type;
    this.subject = data.subject;
    this.desc = data.desc;
    this.coverUrl = data.coverUrl;
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
}

export class ColumnItemContent extends ColumnItem {
  content: string;
  audioUrl: string;
  videoUrl: string;

  constructor(data: any) {
    super(data);

    this.content = data.content;
    this.audioUrl = data.audioUrl;
    this.videoUrl = data.videoUrl;
  }
}

export class ColumnItemDetail {
  column: Column;
  current: ColumnItemContent;
  prev: ColumnItemContent | null;
  next: ColumnItemContent | null;

  constructor(data: any) {
    if (!data) return;

    this.column = new Column(data.column);
    this.prev = data.pre ? new ColumnItemContent(data.pre) : null;
    this.next = data.next ? new ColumnItemContent(data.next) : null;
    this.current = new ColumnItemContent(data.item);
  }
}
