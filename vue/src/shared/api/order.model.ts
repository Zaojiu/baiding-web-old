import {Money} from "../utils/utils";
import {MemberRightType} from './member.model';
import {UserPublicInfoModel} from "./user.model";

export enum OrderObjectType {
  LiveStream = 1, // 付费-话题间
  Media,          // 付费-视频
  Talk,           // 付费-文章
  Event,          // 付费-活动-售票🎫
  Member,         // 付费-会员资格
}

export class PostOrderObject {
  objectId: string;
  objectType: OrderObjectType;
  nums: number;

  constructor(objectId: string, objectType: OrderObjectType, nums: number) {
    this.objectId = objectId;
    this.objectType = objectType;
    this.nums = nums;
  }

  get isTypeMember() {
    return this.objectType === OrderObjectType.Member;
  }

  get isTypeEvent() {
    return this.objectType === OrderObjectType.Event;
  }

  get isTypeTalk() {
    return this.objectType === OrderObjectType.Talk;
  }

  get isTypeMedia() {
    return this.objectType === OrderObjectType.Media;
  }

  get isTypeLive() {
    return this.objectType === OrderObjectType.LiveStream;
  }
}

export class OrderObject {
  orderNo: string;
  subject: string;
  desc: string;
  cover: string;
  objectType: OrderObjectType;
  objectId: string;
  discountedFee: Money;
  fee: Money;
  price: Money;
  nums: number;

  constructor(data: any) {
    if (!data) return;

    this.orderNo = data.orderNo;
    this.subject = data.subject;
    this.desc = data.desc;
    this.cover = data.cover || '/assets/img/default-cover.jpg';
    this.objectType = data.objectType;
    this.objectId = data.objectId;
    this.discountedFee = new Money(data.discountedFee);
    this.fee = new Money(data.fee);
    this.price = new Money(data.price);
    this.nums = data.nums;
  }

  get isTypeMember() {
    return this.objectType === OrderObjectType.Member;
  }

  get isTypeEvent() {
    return this.objectType === OrderObjectType.Event;
  }

  get isTypeTalk() {
    return this.objectType === OrderObjectType.Talk;
  }

  get isTypeMedia() {
    return this.objectType === OrderObjectType.Media;
  }

  get isTypeLive() {
    return this.objectType === OrderObjectType.LiveStream;
  }
}

export class OrderFee {
  totalDiscountedFee: Money; // 折后价（现价使用优惠券后）
  totalFee: Money; // 现价（原价折扣后）
  totalPrice: Money; // 原价
  totalDiscountAmount: Money; // 优惠总金额（原价-折后价）
  items: OrderObject[];
  discounts: Discount[];

  constructor(data: any) {
    if (!data) return;

    this.totalDiscountedFee = new Money(data.totalDiscountedFee);
    this.totalFee = new Money(data.totalFee);
    this.totalPrice = new Money(data.totalPrice);
    this.totalDiscountAmount = new Money(data.totalPrice - data.totalDiscountedFee);

    const items: OrderObject[] = [];
    if (data.items) {
      data.items.forEach((itemData: any) => {
        items.push(new OrderObject(itemData));
      });
    }
    this.items = items;

    const discounts: Discount[] = [];
    if (data.discounts) {
      data.discounts.forEach((discountData: any) => {
        discounts.push(new Discount(discountData, {}));
      });
    }
    this.discounts = discounts;
  }

  get hasMemberItem() {
    let hasMemberItem = false;
    this.items.forEach(item => {
      if (item.isTypeMember) hasMemberItem = true;
    });
    return hasMemberItem;
  }

  get hasEventItem() {
    let hasEventItem = false;
    this.items.forEach(item => {
      if (item.isTypeEvent) hasEventItem = true;
    });
    return hasEventItem;
  }
}

export enum OrderStatus {
  Pending = 1, // 待处理
  Success, // 成功
  Closed, // 关闭
}

export enum OrderType {
  Paid  = 1, // 付款
}

export class OrderMeta {
  orderNo: string;
  uid: number;
  orderType: OrderType;
  subject: string;
  totalDiscountedFee: Money; // 折后价（现价使用优惠券后）
  totalFee: Money; // 现价（原价折扣后）
  totalPrice: Money; // 原价
  totalDiscountAmount: Money; // 优惠总金额（原价-折后价）
  clientIp: string;
  status: OrderStatus;
  adminNote: string;
  expiredAt: Moment;
  finishedAt: Moment;
  updatedAt: Moment;
  createdAt: Moment;

  constructor(data: any) {
    if (!data) return;

    this.orderNo = data.orderNo;
    this.uid = data.uid;
    this.orderType = data.orderType;
    this.subject = data.subject;
    this.totalDiscountedFee = new Money(data.totalDiscountedFee);
    this.totalFee = new Money(data.totalFee);
    this.totalPrice = new Money(data.totalPrice);
    this.totalDiscountAmount = new Money(data.totalPrice - data.totalDiscountedFee);
    this.clientIp = data.clientIp;
    this.status = data.status;
    this.adminNote = data.adminNote;
    this.expiredAt = moment(data.expiredAt);
    this.finishedAt = moment(data.finishedAt);
    this.updatedAt = moment(data.updatedAt);
    this.createdAt = moment(data.createdAt);
  }

  get isSuccess() {
    return this.status === OrderStatus.Success;
  }

  get isPending() {
    return this.status === OrderStatus.Pending;
  }

  get isClosed() {
    return this.status === OrderStatus.Closed;
  }

  get statusHumanize() {
    if (this.status === OrderStatus.Success) {
      return '支付成功';
    } else if (this.status === OrderStatus.Closed) {
      return '已取消';
    } else if (this.status === OrderStatus.Pending) {
      return '待支付';
    } else {
      return `未知状态: ${this.status}`;
    }
  }

  get isExpired() {
    const now = moment();
    return this.expiredAt.isSameOrBefore(now);
  }

  get remainDuration(): Duration {
    const now = moment();
    return moment.duration(this.expiredAt.diff(now));
  }
}

export class Order {
  order: OrderMeta;
  items: OrderObject[];
  discounts: Discount[];

  constructor(data: any) {
    if (!data) return;

    const items: OrderObject[] = [];
    if (data.items) {
      data.items.forEach((itemData: any) => {
        items.push(new OrderObject(itemData));
      });
    }

    this.items = items;

    const discounts: Discount[] = [];
    if (data.discounts) {
      data.discounts.forEach((discountData: any) => {
        discounts.push(new Discount(discountData, {}));
      });
    }

    this.discounts = discounts;

    this.order = new OrderMeta(data.order);
  }

  get isSuccess() {
    return this.order.isSuccess;
  }

  get isPending() {
    return this.order.isPending;
  }

  get isClosed() {
    return this.order.isClosed;
  }

  get hasMemberItem() {
    let hasMemberItem = false;
    this.items.forEach(item => {
      if (item.isTypeMember) hasMemberItem = true;
    });
    return hasMemberItem;
  }

  get hasEventItem() {
    let hasEventItem = false;
    this.items.forEach(item => {
      if (item.isTypeEvent) hasEventItem = true;
    });
    return hasEventItem;
  }
}

enum DiscountCodeStatus {
  Normal    = 0, // 可使用
  Shareing  = 1, // 可使用，分享中，未领取
  Locked    = 6, // 已使用，lock 中
  Used      = 7, // 已使用
  Shared    = 8, // 已分享，被领取
  Expired   = 9, // 已过期，或失效
}

export class DiscountCodeDetail {
  multiItem: boolean;
  canOverlay: number;
  allowOther: boolean;

  constructor(data: any) {
    if (!data) return;

    this.multiItem = data.multiItem;
    this.canOverlay = data.canOverlayN;
    this.allowOther = data.allowOther;
  }
}

export class Discount {
  title: string;
  desc: string;
  code: string;
  discount: DiscountCodeDetail;
  discountId: string;
  owner: UserPublicInfoModel;
  toUser: UserPublicInfoModel;
  fromUser: UserPublicInfoModel;
  canShare: boolean;
  orderNo: string;
  kind: MemberRightType;
  status: DiscountCodeStatus;
  startAt: Moment;
  expiredAt: Moment;
  usedAt: Moment;
  createdAt: Moment;
  canUse = true;
  canUseFromApi = true;

  constructor(data: any, users: any) {
    this.title = data.detail && data.detail.title;
    this.desc = data.detail && data.detail.desc;
    this.code = data.code;

    if (data.detail && data.detail.discount) {
      this.discount = new DiscountCodeDetail(data.detail.discount);
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
    return this.status === DiscountCodeStatus.Normal;
  }

  get isStatusShareing(): boolean {
    return this.status === DiscountCodeStatus.Shareing;
  }

  get isStatusLocked(): boolean {
    return this.status === DiscountCodeStatus.Locked;
  }

  get isStatusUsed(): boolean {
    return this.status === DiscountCodeStatus.Used;
  }

  get isStatusShared(): boolean {
    return this.status === DiscountCodeStatus.Shared;
  }

  get isStatusExpired(): boolean {
    return this.status === DiscountCodeStatus.Expired;
  }
}
