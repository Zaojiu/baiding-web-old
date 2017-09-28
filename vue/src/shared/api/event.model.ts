import {Money} from "../utils/utils";
import {SpeakerModel} from "./speaker.model";

export class EventTicketModel {
  id: string;
  name: string;
  totalFee: Money; // 价格，单位“分”
  memberFee: Money; // 会员价，单位“分”
  originFee: Money; // 原价，单位分
  sellTotal: number;
  leftTotal: number;

  constructor(ticketData: any) {
    this.id = ticketData ? ticketData.id : '';
    this.name = ticketData ? ticketData.name : '';
    this.totalFee = ticketData && ticketData.totalFee ? new Money(ticketData.totalFee) : new Money(0);
    this.memberFee = ticketData && ticketData.memberFee ? new Money(ticketData.memberFee) : new Money(0);
    this.originFee = ticketData && ticketData.originFee ? new Money(ticketData.originFee) : new Money(0);
    this.sellTotal = ticketData ? ticketData.sellTotal : 0;
    this.leftTotal = ticketData ? ticketData.leftTotal : 0;
  }
}

class EventMetaModel {
  content: string;
  startAt: string;
  startAtParsed: Moment;
  endAt: string;
  endAtParsed: Moment;
  applyStartAt: string;
  applyStartAtParsed: Moment;
  applyEndAt: string;
  applyEndAtParsed: Moment;
  province: string;
  city: string;
  address: string;
  location: number[];
  speakers: SpeakerModel[];
  tickets: EventTicketModel[];

  constructor(eventMetaData: any) {
    this.content = eventMetaData ? eventMetaData.content : '';
    this.startAt = eventMetaData ? eventMetaData.startAt : '';
    this.startAtParsed = eventMetaData ? moment(eventMetaData.startAt) : moment();
    this.endAt = eventMetaData ? eventMetaData.endAt : '';
    this.endAtParsed = eventMetaData ? moment(eventMetaData.endAt) : moment();
    this.applyStartAt = eventMetaData ? eventMetaData.applyStartAt : '';
    this.applyStartAtParsed = eventMetaData ? moment(eventMetaData.applyStartAt) : moment();
    this.applyEndAt = eventMetaData ? eventMetaData.applyEndAt : '';
    this.applyEndAtParsed = eventMetaData ? moment(eventMetaData.applyEndAt) : moment();
    this.province = eventMetaData ? eventMetaData.province : '';
    this.city = eventMetaData ? eventMetaData.city : '';
    this.address = eventMetaData ? eventMetaData.address : '';
    this.location = eventMetaData ? eventMetaData.location : '';
    this.speakers = [];
    const speakersData = eventMetaData && eventMetaData.speakers ? eventMetaData.speakers : [];
    speakersData.forEach((speaker: any) => {
      this.speakers.push(new SpeakerModel(speaker));
    });

    this.tickets = [];
    const ticketsData = eventMetaData && eventMetaData.tickets ? eventMetaData.tickets : [];
    ticketsData.forEach((ticket: any) => {
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
    this.meta = new EventMetaModel(eventData.meta);
  }
}
