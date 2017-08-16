import {Money} from "../../utils/utils";

class SpeakerModel {
  id: string;
  uid: number;
  subject: string;
  title: string;
  coverUrl: string;
  desc: string;

  constructor(speakerData: any) {
    this.id = speakerData ? speakerData.id : '';
    this.uid = speakerData ? speakerData.uid : '';
    this.subject = speakerData ? speakerData.subject : '';
    this.title = speakerData ? speakerData.desc : ''; // 目前的desc是title。。。等待后端修改
    this.coverUrl = speakerData ? speakerData.coverUrl : '';
    // this.desc = speakerData ? speakerData.desc : '';
  }
}

class EventTicketModel {
  id: string;
  name: string;
  price: Money;
  sellTotal: number;
  leftTotal: number;

  constructor(ticketData: any) {
    this.id = ticketData ? ticketData.id : '';
    this.name = ticketData ? ticketData.name : '';
    this.price = ticketData ? new Money(ticketData.price) : null;
    this.sellTotal = ticketData ? ticketData.sellTotal : 0;
    this.leftTotal = ticketData ? ticketData.leftTotal : 0;
  }
}

class EventMetaModel {
  startAt: string;
  startAtParsed: Moment;
  endAt: string;
  endAtParsed: Moment;
  province: string;
  city: string;
  address: string;
  location: number[];
  speakers: SpeakerModel[];
  tickets: EventTicketModel[];

  constructor(eventMetaData: any) {
    this.startAt = eventMetaData ? eventMetaData.startAt : '';
    this.startAtParsed = eventMetaData ? moment(eventMetaData.startAt) : moment();
    this.endAt = eventMetaData ? eventMetaData.endAt : '';
    this.endAtParsed = eventMetaData ? moment(eventMetaData.endAt) : moment();
    this.province = eventMetaData ? eventMetaData.province : '';
    this.city = eventMetaData ? eventMetaData.city : '';
    this.address = eventMetaData ? eventMetaData.address : '';
    this.location = eventMetaData ? eventMetaData.location : '';
    this.speakers = [];
    const speakersData = eventMetaData && eventMetaData.speakers ? eventMetaData.speakers : [];
    speakersData.forEach(speaker => {
      this.speakers.push(new SpeakerModel(speaker));
    });

    this.tickets = [];
    const ticketsData = eventMetaData && eventMetaData.tickets ? eventMetaData.tickets : [];
    ticketsData.forEach(ticket => {
      this.tickets.push(new EventTicketModel(ticket));
    });
  }
}

export class EventModel {
  id: string;
  subject: string;
  desc: string;
  coverUrl: string;
  meta: EventMetaModel;

  constructor(eventData: any) {
    this.id = eventData ? eventData.id : '';
    this.subject = eventData ? eventData.subject : '';
    this.desc = eventData ? eventData.desc : '';
    this.coverUrl = eventData ? eventData.coverUrl : '';
    this.meta = eventData ? new EventMetaModel(eventData.meta) : null;
  }
}

export class EventTicketFeeModel {
  totalDiscountedFee: number; // 折后费用
  totalFee: number;           // 总费用
  totalPrice: number;         // 原价

  constructor(totalDiscountedFee: number, totalFee: number, totalPrice: number) {
    this.totalDiscountedFee = totalDiscountedFee;
    this.totalFee = totalFee;
    this.totalPrice = totalPrice;
  }
}

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
