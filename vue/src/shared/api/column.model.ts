import {Speaker} from "./speaker.model";
import {Money} from "./money.model";

export enum ColumnStatus {
  Unpublish = 0,
  Publish,
}

export class ColumnUserInfo {
  isPaid: boolean;
  paidAt: string;
  paidAtParsed: Moment;
  praised: boolean;
  shared: boolean;

  constructor(isPaid: boolean, paidAt: string, praised: boolean, shared: boolean) {
    this.isPaid = isPaid;
    this.paidAt = paidAt;
    this.paidAtParsed = moment(paidAt);
    this.praised = praised;
    this.shared = shared;
  }
}

export class Column {
  id: string;
  speaker: Speaker | null;
  subject: string;
  desc: string;
  detail: string;
  totalFee: Money;
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

  constructor(id: string, speaker: Speaker | null, subject: string,
              desc: string, detail: string, totalFee: number,
              isNeedPay: boolean, subscribedTotal: number, totalVol: number,
              currentVol: number, status: ColumnStatus,
              publishAt: string, createdAt: string, updatedAt: string, currentUserInfo: ColumnUserInfo | null) {
    this.id = id;
    this.speaker = speaker;
    this.subject = subject;
    this.desc = desc;
    this.detail = detail;
    this.totalFee = new Money(totalFee);
    this.isNeedPay = isNeedPay;
    this.subscribedTotal = subscribedTotal;
    this.totalVol = totalVol;
    this.currentVol = currentVol;
    this.status = status;
    this.publishAt = publishAt;
    this.publishAtParsed = moment(publishAt);
    this.createdAt = createdAt;
    this.createdAtParsed = moment(createdAt);
    this.updatedAt = updatedAt;
    this.updatedAtParsed = moment(updatedAt);
    this.currentUserInfo = currentUserInfo;
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
  payType: ColumnItemPayType;
  status: ColumnItemStatus;
  viewTotal: number;
  commentTotal: number;
  publishAt: string;
  publishAtParsed: Moment;
  createdAt: string;
  createdAtParsed: Moment;
  updatedAt: string;
  updatedAtParsed: Moment;

  constructor(id: string, columnId: string, vol: number, type: ColumnItemType, subject: string,
              desc: string, payType: ColumnItemPayType, status: ColumnItemStatus, viewTotal: number,
              commentTotal: number, publishAt: string, createdAt: string, updatedAt: string) {
    this.id = id;
    this.columnId = columnId;
    this.vol = vol;
    this.type = type;
    this.subject = subject;
    this.desc = desc;
    this.payType = payType;
    this.status = status;
    this.viewTotal = viewTotal;
    this.commentTotal = commentTotal;
    this.publishAt = publishAt;
    this.publishAtParsed = moment(publishAt);
    this.createdAt = createdAt;
    this.createdAtParsed = moment(createdAt);
    this.updatedAt = updatedAt;
    this.updatedAtParsed = moment(updatedAt);
  }
}

export class ColumnItemContent extends ColumnItem {
  content: string;
  audioUrl: string;
  videoUrl: string;

  constructor(id: string, columnId: string, vol: number, type: ColumnItemType, subject: string,
              desc: string, payType: ColumnItemPayType, status: ColumnItemStatus, viewTotal: number,
              commentTotal: number, publishAt: string, createdAt: string, updatedAt: string,
              content: string, audioUrl: string, videoUrl: string) {

    super(id, columnId, vol, type, subject, desc, payType, status, viewTotal, commentTotal, publishAt, createdAt, updatedAt);

    this.content = content;
    this.audioUrl = audioUrl;
    this.videoUrl = videoUrl;
  }
}

export class ColumnItemDetail {
  column: Column;
  current: ColumnItemContent;
  prev: ColumnItemContent | null;
  next: ColumnItemContent | null;

  constructor(column: Column, current: ColumnItemContent, prev: ColumnItemContent | null, next: ColumnItemContent | null) {
    this.column = column;
    this.current = current;
    this.prev = prev;
    this.next = next;
  }
}
