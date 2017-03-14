import {ResourceType} from "../resource-type.enums";

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

    this.desc = data.desc;
    this.coverUrl = `${data.coverUrl}?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmallUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${Math.round(+data.updatedAt)}` : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/60x&updatedAt=${Math.round(+data.updatedAt)}` : '/assets/img/default-cover.jpg';

    this.isNeedPay = data.isNeedPay;
    this.totalFee = data.totalFee;
    this.publishAt = moment(data.publishAt);
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
