import {UserInfoModel} from "../user-info/user-info.model";
import {ResourceType} from "../resource-type.enums";

export class SearchPaging {
  from: number;
  size: number;
  total: number;

  constructor(from: number, size: number, total: number) {
    this.from = from;
    this.size = size;
    this.total = total;
  }
}

export class SearchResultItem {
  id: string;
  userInfo: UserInfoModel; // 后端未返回includes, 此字段暂未用到;
  subject: string;
  desc: string;
  content: string;
  type: ResourceType;
  coverUrl: string;
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  cover169Url: string;
  coverSmall169Url: string;
  coverThumbnail169Url: string;
  cover11Url: string;
  coverSmall11Url: string;
  coverThumbnail11Url: string;
  publishAt: Moment;

  constructor(data: any) {
    this.id = data.id;
    this.subject = data.subject;
    this.desc = data.desc;
    this.content = data.meta && data.meta.content ? data.meta.content : '';

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

    this.publishAt = moment(data.publishAt/1e6);

    this.coverUrl = `${data.coverUrl}?updatedAt=${this.publishAt.unix()}`;
    this.coverSmallUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${this.publishAt.unix()}`;
    this.coverThumbnailUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${this.publishAt.unix()}`;

    this.cover169Url = `${data.coverUrl}~16-9?updatedAt=${this.publishAt.unix()}`;
    this.coverSmall169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${this.publishAt.unix()}`;
    this.coverThumbnail169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${this.publishAt.unix()}`;

    this.cover11Url = `${data.coverUrl}~1-1?updatedAt=${this.publishAt.unix()}`;
    this.coverSmall11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${this.publishAt.unix()}`;
    this.coverThumbnail11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${this.publishAt.unix()}`;


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

export class SearchResult {
  result: SearchResultItem[];
  paging: SearchPaging;

  constructor(result: SearchResultItem[], paging: SearchPaging) {
    this.result = result;
    this.paging = paging;
  }
}
