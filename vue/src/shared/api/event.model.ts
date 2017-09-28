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
  meta: EventMetaModel;

  constructor(data: any) {
    if (!data) return;

    this.id = data.id;
    this.subject = data.subject;
    this.desc = data.desc;
    this.coverUrl = data.coverUrl;
    this.coverSmallUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnailUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;

    this.cover169Url = `${data.coverUrl}~16-9`;
    this.coverSmall169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnail169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;

    this.cover11Url = `${data.coverUrl}~1-1`;
    this.coverSmall11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnail11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;

    this.meta = new EventMetaModel(data.meta);
  }
}
