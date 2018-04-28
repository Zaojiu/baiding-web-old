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

  constructor(data: any) {
    if (!data) return;

    this.id = data.id;
    this.name = data.name;
    this.totalFee = data.totalFee ? new Money(data.totalFee) : new Money(0);
    this.memberFee = data.memberFee ? new Money(data.memberFee) : new Money(0);
    this.originFee = data.originFee ? new Money(data.originFee) : new Money(0);
    this.sellTotal = data.sellTotal;
    this.leftTotal = data.leftTotal;
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
  disableDiscount: boolean;

  constructor(data: any) {
    if (!data) return;

    this.content = data.content;
    this.startAt = data.startAt;
    this.startAtParsed = moment(data.startAt);
    this.endAt = data.endAt;
    this.endAtParsed = moment(data.endAt);
    this.applyStartAt = data.applyStartAt;
    this.applyStartAtParsed = moment(data.applyStartAt);
    this.applyEndAt = data.applyEndAt;
    this.applyEndAtParsed = moment(data.applyEndAt);
    this.province = data.province;
    this.city = data.city;
    this.address = data.address;
    this.location = data.location;
    this.speakers = [];
    this.disableDiscount = data.disableDiscount || false;
    const speakersData = data && data.speakers ? data.speakers : [];
    speakersData.forEach((speaker: any) => {
      this.speakers.push(new SpeakerModel(speaker));
    });

    this.tickets = [];
    const ticketsData = data && data.tickets ? data.tickets : [];
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
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  cover169Url: string;
  coverSmall169Url: string;
  coverThumbnail169Url: string;
  cover11Url: string;
  coverSmall11Url: string;
  coverThumbnail11Url: string;
  isForMember: boolean;
  meta: EventMetaModel;
  updatedAt: string;

  constructor(data: any) {
    if (!data) return;

    const coverUrl = data.coverUrl;

    this.id = data.id;
    this.subject = data.subject;
    this.desc = data.desc;
    this.updatedAt = data.updatedAt;
    this.isForMember = data.isForMember;
    this.coverUrl = coverUrl ? encodeURI(coverUrl) : '/assets/img/default-cover.jpg';
    this.coverSmallUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover169Url = coverUrl ? encodeURI(`${coverUrl}~16-9`) + '?t=' + this.updatedAt : '/assets/img/default-cover.jpg';
    this.coverSmall169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover11Url = coverUrl ? encodeURI(`${coverUrl}~1-1`) : '/assets/img/default-cover.jpg';
    this.coverSmall11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';

    this.meta = new EventMetaModel(data.meta);
  }
}
