import {SpeakerModel} from "./speaker.model";
import {Money} from "../utils/utils";
import {PayType} from "./pay.enum";
import {UserInfoModel} from "./user.model";

export class CourseUserInfo {
  paid: boolean;
  paidAt: string;
  paidAtParsed: Moment;
  paidType: PayType;
  praised: boolean;
  praisedAt: Moment;
  praisedAtParsed: Moment;
  favorited: boolean;

  constructor(data: any) {
    if (!data) return;
    this.paid = data.isPaid;
    this.paidAt = data.paidAt;
    this.paidAtParsed = moment(data.paidAt);
    this.paidType = data.paidType;
    this.praised = !moment(data.praisedAt).isZero();
    this.praisedAt = data.praisedAt;
    this.favorited = !moment(data.favoritedAt).isZero();
    this.praisedAtParsed = moment(data.praisedAt);
  }
}

export enum CourseStatus {
  Unpublish = 0,
  Publish,
}

export class Course {
  id: string;
  coverUrl: string;
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  cover169Url: string;
  coverSmall169Url: string;
  coverThumbnail169Url: string;
  cover11Url: string;
  coverSmall11Url: string;
  coverThumbnail11Url: string;
  speaker: SpeakerModel;
  subject: string;
  desc: string;
  content: string;
  groupId: string;
  totalFee: Money; // 价格，单位“分”
  memberFee: Money; // 会员价，单位“分”
  originFee: Money; // 原价，单位分
  isNeedPay: boolean;
  subscribedTotal: number;
  totalVol: number;
  currentVol: number;
  status: CourseStatus;
  publishAt: string;
  publishAtParsed: Moment;
  createdAt: string;
  createdAtParsed: Moment;
  updatedAt: string;
  updatedAtParsed: Moment;
  currentUserInfo: CourseUserInfo;
  commentTotal: number;
  praisedTotal: number;
  favoriteTotal: number;

  constructor(data: any, currentUserInfo?: any) {
    if (!data) return;

    const coverUrl = data.coverUrl;

    this.id = data.id;
    this.coverUrl = coverUrl ? encodeURI(coverUrl) : '/assets/img/default-cover.jpg';
    this.coverSmallUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover169Url = coverUrl ? encodeURI(`${coverUrl}~16-9`) : '/assets/img/default-cover.jpg';
    this.coverSmall169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover11Url = coverUrl ? encodeURI(`${coverUrl}~1-1`) : '/assets/img/default-cover.jpg';
    this.coverSmall11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.speaker = new SpeakerModel(data.speaker);
    this.favoriteTotal = data.favoriteTotal;
    this.praisedTotal = data.praiseTotal;
    this.commentTotal = data.commentTotal;
    this.subject = data.subject;
    this.desc = data.desc;
    this.groupId = data.groupId;
    this.content = data.content;
    this.totalFee = new Money(data.totalFee);
    this.memberFee = new Money(data.memberFee);
    this.originFee = new Money(data.originFee);
    this.isNeedPay = data.isNeedPay;
    this.subscribedTotal = data.subscribedTotal;
    this.totalVol = data.totalVol;
    this.currentVol = data.currentVol;
    this.status = data.status;
    this.publishAt = data.publishAt;
    this.publishAtParsed = moment(data.publishAt);
    this.createdAt = data.createdAt;
    this.createdAtParsed = moment(data.createdAt);
    this.updatedAt = data.updatedAt;
    this.updatedAtParsed = moment(data.updatedAt);
    this.currentUserInfo = currentUserInfo ? new CourseUserInfo(currentUserInfo) : new CourseUserInfo(null);
  }

  get paid(): boolean {
    return !this.isNeedPay || (!!this.currentUserInfo && this.currentUserInfo.paid);
  }
}

export enum CourseItemType {
  Post = 1, // 文章
  Audio, // 音频
  Video, // 视频
}

export enum CourseItemPayType {
  Single = 1, //单品售卖
  InCourse, //专栏内售卖
  Free, //免费
}

export enum CourseItemStatus {
  Ready = 1, //上架
  Draft, //草稿
  NotReady, // 内容未上架
}

export class CourseItem {
  id: string;
  courseId: string;
  vol: number;
  type: CourseItemType;
  subject: string;
  desc: string;
  audioUrl: string;
  toggle: boolean;
  content: string;
  coverUrl: string;
  coverSmallUrl: string;
  coverThumbnailUrl: string;
  cover169Url: string;
  coverSmall169Url: string;
  coverThumbnail169Url: string;
  cover11Url: string;
  coverSmall11Url: string;
  coverThumbnail11Url: string;
  duration: Duration;
  totalFee: Money; // 价格，单位“分”
  memberFee: Money; // 会员价，单位“分”
  originFee: Money; // 原价，单位分
  payType: CourseItemPayType;
  status: CourseItemStatus;
  viewTotal: number;
  commentTotal: number;
  praisedTotal: number;
  publishAt: string;
  publishAtParsed: Moment;
  createdAt: string;
  createdAtParsed: Moment;
  updatedAt: string;
  updatedAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    const coverUrl = data.coverUrl;
    this.id = data.id;
    this.courseId = data.courseId;
    this.vol = data.vol;
    this.type = data.type;
    this.subject = data.subject;
    this.desc = data.desc;
    this.audioUrl = data.audioUrl;
    this.toggle = false;
    this.content = data.content;
    this.coverUrl = coverUrl ? encodeURI(coverUrl) : '/assets/img/default-cover.jpg';
    this.coverSmallUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnailUrl = coverUrl ? encodeURI(`${coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover169Url = coverUrl ? encodeURI(`${coverUrl}~16-9`) : '/assets/img/default-cover.jpg';
    this.coverSmall169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail169Url = coverUrl ? encodeURI(`${coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.cover11Url = coverUrl ? encodeURI(`${coverUrl}~1-1`) : '/assets/img/default-cover.jpg';
    this.coverSmall11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.coverThumbnail11Url = coverUrl ? encodeURI(`${coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`) : '/assets/img/default-cover.jpg';
    this.duration = moment.duration(data.duration);
    this.totalFee = new Money(data.totalFee);
    this.memberFee = new Money(data.memberFee);
    this.originFee = new Money(data.originFee);
    this.payType = data.payType;
    this.status = data.status;
    this.viewTotal = data.viewTotal;
    this.commentTotal = data.commentTotal;
    this.praisedTotal = data.praisedTotal;
    this.publishAt = data.publishAt;
    this.publishAtParsed = moment(data.publishAt);
    this.createdAt = data.createdAt;
    this.createdAtParsed = moment(data.createdAt);
    this.updatedAt = data.updatedAt;
    this.updatedAtParsed = moment(data.updatedAt);
  }

  get isTypePost(): boolean {
    return this.type === CourseItemType.Post;
  }

  get isTypeVideo(): boolean {
    return this.type === CourseItemType.Video;
  }

  get isTypeAudio(): boolean {
    return this.type === CourseItemType.Audio;
  }

  get isStatusNotReady(): boolean {
    return this.status === CourseItemStatus.NotReady;
  }

  get isStatusReady(): boolean {
    return this.status === CourseItemStatus.Ready;
  }

  get isPayTypeCourse(): boolean {
    return this.payType === CourseItemPayType.InCourse;
  }

  get isPayTypeSingle(): boolean {
    return this.payType === CourseItemPayType.Single;
  }

  get isPayTypeFree(): boolean {
    return this.payType === CourseItemPayType.Free;
  }
}

export class CourseItemUserInfo {
  paid: boolean;
  paidAt: string;
  paidAtParsed: Moment;
  praised: boolean;
  praisedAt: Moment;
  praisedAtParsed: Moment;

  constructor(data: any) {
    if (!data) return;

    this.paid = data.isPaid;
    this.paidAt = data.paidAt;
    this.paidAtParsed = moment(data.paidAt);
    this.praised = !moment(data.praisedAt).isZero();
    this.praisedAt = data.praisedAt;
    this.praisedAtParsed = moment.unix(data.praisedAt);
  }
}

export class CourseItemContent extends CourseItem {
  content: string;
  audioUrl: string;
  freeAudioUrl: string;
  videoUrl: string;
  currentUserInfo: CourseItemUserInfo;

  constructor(data: any, currentUserInfo?: any) {
    if (!data) return;

    super(data);

    this.content = data.content;
    this.audioUrl = data.audioUrl;
    this.videoUrl = data.videoUrl;
    this.currentUserInfo = currentUserInfo ? new CourseItemUserInfo(currentUserInfo) : new CourseItemUserInfo({});
  }
}

export class CourseItemDetail {
  course: Course;
  current: CourseItemContent;
  prev: CourseItemContent | null;
  next: CourseItemContent | null;
  item: CourseItem | null;

  constructor(data: any) {
    if (!data) return;

    this.course = new Course(data.course, data.course_user_info);
    this.prev = data.pre ? new CourseItemContent(data.pre) : null;
    this.next = data.next ? new CourseItemContent(data.next) : null;
    this.item = data.item ? new CourseItem(data.item) : null;
    this.current = new CourseItemContent(data.item, data.item_user_info);
  }

  get paid(): boolean {
    return this.course.paid;
  }
}

export class CourseItemCommentParentModel {
  user: UserInfoModel;
  content: string;
  createdAtParsed: Moment;

  constructor(userInfo: UserInfoModel, content: string, createdAtParsed: Moment) {
    this.user = userInfo;
    this.content = content;
    this.createdAtParsed = createdAtParsed;
  }
}

export class CommentModel {
  comments: CourseItemCommentModel[];
  marker: string;

  constructor(comments: CourseItemCommentModel[], marker: string) {
    this.comments = comments;
    this.marker = marker;
  }
}

export class CourseItemCommentModel {
  id: string;
  user: UserInfoModel;
  parent: CourseItemCommentParentModel;
  toUsers: UserInfoModel[] = [];
  content: string;
  createdAtParsed: Moment;
  createdAt: string;

  constructor(data: any, users: any) {
    this.id = data.id;
    if (users) this.user = users[data.uid];
    if (data.parent && users) {
      this.parent = new CourseItemCommentParentModel(users[data.parent.uid], data.parent.content, moment(+data.parent.createdAt / 1e6));
    }
    if (data.toUids) {
      for (let uid of data.toUsers) {
        this.toUsers.push(users[uid]);
      }
    }
    this.content = data.content;
    this.createdAtParsed = moment(data.createdAt);
    this.createdAt = data.createdAt;
  }
}
