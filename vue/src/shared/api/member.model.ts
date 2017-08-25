import {UserPublicInfoModel} from "./user.model";

enum MemberRightType {
  Event = 1, // 造就 会员 - talk
  Book, // 造就 会员 - 赠书
  NormalDiscount, // 造就 普通 - 折扣
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

enum MemberRightCodeStatus {
  Normal    = 0, // 可使用
  Shareing  = 1, // 可使用，分享中，未领取
  Locked    = 6, // 已使用，lock 中
  Used      = 7, // 已使用
  Shared    = 8, // 已分享，被领取
  Expired   = 9, // 已过期，或失效
}

export class MemberRightsCodeDiscount {
  multiItem: boolean;
  canOverlay: boolean;
  allowOther: boolean;

  constructor(data: any) {
    if (!data) return;

    this.multiItem = data.multiItem;
    this.canOverlay = data.canOverlay;
    this.allowOther = data.allowOther;
  }
}

export class MemberRightsCode {
  title: string;
  desc: string;
  code: string;
  discount: MemberRightsCodeDiscount;
  discountId: string;
  owner: UserPublicInfoModel;
  toUser: UserPublicInfoModel;
  fromUser: UserPublicInfoModel;
  canShare: boolean;
  orderNo: string;
  kind: MemberRightType;
  status: MemberRightCodeStatus;
  startAt: Moment;
  expiredAt: Moment;
  usedAt: Moment;
  createdAt: Moment;

  constructor(data: any, users: any) {
    this.title = data.detail && data.detail.title;
    this.desc = data.detail && data.detail.desc;
    this.code = data.code;

    if (data.detail && data.detail.discount) {
      this.discount = new MemberRightsCodeDiscount(data.detail.discount);
    }

    this.discountId = data.discountId;

    if (users) {
      if (data.owner) this.owner = new UserPublicInfoModel(users[data.owner]);
      if (data.toUid) this.toUser = new UserPublicInfoModel(users[data.toUid]);
      if (data.fromUid) this.fromUser = new UserPublicInfoModel(users[data.fromUid]);
    }

    this.canShare = data.canShare;
    this.orderNo = data.orderNo;
    this.kind = data.detail && data.detail.kind;
    this.status = data.status;
    this.startAt = moment(data.startAt);
    this.expiredAt = moment(data.expiredAt);
    this.usedAt = moment(data.usedAt);
    this.createdAt = moment(data.createdAt);
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

  get isStatusNormal(): boolean {
    return this.status === MemberRightCodeStatus.Normal;
  }

  get isStatusShareing(): boolean {
    return this.status === MemberRightCodeStatus.Shareing;
  }

  get isStatusLocked(): boolean {
    return this.status === MemberRightCodeStatus.Locked;
  }

  get isStatusUsed(): boolean {
    return this.status === MemberRightCodeStatus.Used;
  }

  get isStatusShared(): boolean {
    return this.status === MemberRightCodeStatus.Shared;
  }

  get isStatusExpired(): boolean {
    return this.status === MemberRightCodeStatus.Expired;
  }
}
