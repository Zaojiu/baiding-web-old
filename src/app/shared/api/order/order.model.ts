
import {Money} from "../../utils/utils";

enum OrderType {
  Paid = 1,// 付款
}

enum OrderStatus {
  Pending = 1, // 待处理
  Success, // 成功
  Closed, // 关闭
}

export class OrderModel {
  orderNo: string;
  orderType: OrderType;
  status: OrderStatus;
  subject: string;
  totalDiscountedFee: Money;
  totalFee: Money;
  totalPrice: Money;
  createdAt: string;
  createdAtParsed: Moment;
  expiredAt: string;
  expiredAtParsed: Moment;
  finishedAt: string;
  finishedAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    this.orderNo = data.orderNo;
    this.orderType = data.orderType;
    this.status = data.status;
    this.subject = data.subject;
    this.totalDiscountedFee = new Money(data.totalDiscountedFee);
    this.totalFee = new Money(data.totalFee);
    this.totalPrice = new Money(data.totalPrice);
    this.createdAt = data.createdAt;
    this.createdAtParsed = moment(data.createdAt);
    this.expiredAt = data.expiredAt;
    this.expiredAtParsed = moment(data.expiredAt);
    this.finishedAt = data.finishedAt;
    this.finishedAtParsed = moment(data.finishedAt);
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
}
