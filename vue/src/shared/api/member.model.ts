export enum MemberRightType {
  Event = 1, // 造就 会员 - talk
  Book, // 造就 会员 - 赠书
  NormalDiscount = 9, // 造就 普通 - 折扣
}

export class MemberRight {
  id: string;
  title: string;
  desc: string;
  kind: MemberRightType;
  startTime: Moment;
  endTime: Moment;
  canShare: boolean;
  availableAmount: number; // 可用数
  totalAmount: number; // 总数
  canShareAmount: number; // 可分享数
  sharedAmount: number; // 已分享数

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.desc = data.desc;
    this.kind = data.kind;
    this.startTime = data.detail && data.detail.start ? moment(data.detail.start) : moment(0);
    this.endTime = data.detail && data.detail.end ? moment(data.detail.end) : moment(0);
    this.canShare = data.detail && data.detail.canShare;
    this.availableAmount = data.available;
    this.totalAmount = data.total;
    this.canShareAmount = data.canShare;
    this.sharedAmount = data.shared;
  }

  get isTypeEvent(): boolean {
    return this.kind === MemberRightType.Event;
  }

  get isTypeBook(): boolean {
    return this.kind === MemberRightType.Book;
  }

  get isTypeNormalDiscount(): boolean {
    return this.kind === MemberRightType.NormalDiscount;
  }
}
