import {ResourceType} from "../resource-type.enums";
import {EventModel} from "../event/event.model";

export class MyListResult {
  result: MyListModel[];
  marker: string;
  hasMore: boolean;

  constructor(result: MyListModel[], marker: string, hasMore: boolean) {
    this.result = result;
    this.marker = marker;
    this.hasMore = hasMore;
  }
}

export class MyListModel {
  id: string;
  type: ResourceType;
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
  isNeedPay: boolean;
  totalFee: number;
  publishAt: Moment;

  constructor(data: any) {
    this.id = data.id;
    this.subject = data.subject;

    switch (data.type) {
      case 1:
        this.type = ResourceType.Live;
        break;
      case 2:
        this.type = ResourceType.Talk;
        break;
      case 3:
        this.type = ResourceType.Talk;
        break;
      case 4:
        this.type = ResourceType.Speaker;
        break;
      default:
        this.type = ResourceType.Unknown;
    }

    this.publishAt = moment(data.publishAt);
    this.desc = data.desc;
    this.coverUrl = `${data.coverUrl}?updatedAt=${this.publishAt.unix()}`;
    this.coverSmallUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${this.publishAt.unix()}`;
    this.coverThumbnailUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${this.publishAt.unix()}`;

    this.cover169Url = `${data.coverUrl}~16-9?updatedAt=${this.publishAt.unix()}`;
    this.coverSmall169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${this.publishAt.unix()}`;
    this.coverThumbnail169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${this.publishAt.unix()}`;

    this.cover11Url = `${data.coverUrl}~1-1?updatedAt=${this.publishAt.unix()}`;
    this.coverSmall11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${this.publishAt.unix()}`;
    this.coverThumbnail11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${this.publishAt.unix()}`;

    this.isNeedPay = data.isNeedPay;
    this.totalFee = data.totalFee;
  }

  isLive(): boolean {
    return this.type === ResourceType.Live;
  }

  isTalk(): boolean {
    return this.type === ResourceType.Talk;
  }

  isSpeaker(): boolean {
    return this.type === ResourceType.Speaker;
  }
}

enum TicketStatus {
  Paid = 1,
  Approved,
  Declined,
}

export class TicketModel {
  id: string;
  ticketNo: string;
  status: TicketStatus;
  eventId: string;
  name: string;
  mobile: string;
  event: EventModel;
  signedInAt: string;
  signedInAtParsed: Moment;
  applyAt: string;
  applyAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    this.id = data.id;
    this.ticketNo = data.ticketNo;
    this.status = data.status;
    this.eventId = data.eventId;
    this.name = data.name;
    this.mobile = data.mobile;
    this.event = new EventModel(data.event); // no speaker data
    this.signedInAt = data.signedInAt;
    this.signedInAtParsed = moment(data.signedInAt);
    this.applyAt = data.applyAt;
    this.applyAtParsed = moment(data.applyAt);
  }
}
