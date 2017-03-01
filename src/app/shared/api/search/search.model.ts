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

    this.coverUrl = `${data.coverUrl}?updatedAt=${Math.round(+data.publish_at)}`;
    this.coverSmallUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x/gravity/Center/crop/640x300&updatedAt=${Math.round(+data.publish_at)}` : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/60x/gravity/Center/crop/60x&updatedAt=${Math.round(+data.publish_at)}` : '/assets/img/default-cover.jpg';
    this.publishAt = moment(data.publishAt/1e6);
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
