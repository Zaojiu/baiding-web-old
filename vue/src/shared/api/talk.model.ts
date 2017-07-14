import {UserInfoModel} from "./user.model";

export class TalkInfoMediaModel {
  mp3: string;
  mp4: string;
  mp4_sd: string;
  mp4_hd: string;
  preview: string;
  duration: Duration;

  constructor(mp3 = '', mp4 = '', mp4_sd = '', mp4_hd = '', preview = '', duration = 0) {
    this.mp3 = mp3;
    this.mp4 = mp4;
    this.mp4_sd = mp4_sd;
    this.mp4_hd = mp4_hd;
    this.preview = preview;
    this.duration = moment.duration(duration);
  }

  get hasVideo(): boolean {
    return !!this.mp4 || !!this.mp4_sd || !!this.mp4_hd;
  }

  get hasAudio(): boolean {
    return !!this.mp3;
  }

  get hasPreview(): boolean {
    return !!this.preview;
  }
}

export class TalkInfoRefModel {
  link: string;
  title: string;

  constructor(link = '', title = '') {
    this.link = link;
    this.title = title;
  }
}

export class TalkInfoSpeakerModel {
  id: string;
  uid: number;
  name: string;
  title: string;
  avatar: string;

  constructor(id = '', uid = 0, name = '', title = '', avatar = '') {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.title = title;
    this.avatar = avatar;
  }
}

export class TalkInfoCatalogModel {
  id: string;
  title: string;

  constructor(id = '', title = '') {
    this.id = id;
    this.title = title;
  }
}

export class TalkInfoModel {
  id: string;
  userInfo: UserInfoModel;
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
  isNeedPay: string;
  totalFee: number;
  praiseTotal: number;
  isPraised: boolean;
  commentTotal: number;
  isFavorited: boolean;
  shareTotal: number;
  totalUsers: number;
  latestPraisedUsers: UserInfoModel[];
  latestUsers: UserInfoModel[];
  refLink: TalkInfoRefModel[];
  speaker: TalkInfoSpeakerModel[];
  tags: string[] = [];
  categories: TalkInfoCatalogModel[][] = [];
  isOriginal: boolean;
  content: string;
  media: TalkInfoMediaModel;

  publishAt: Moment;
  createdAt: Moment;
  updatedAt: Moment;

  constructor (data: any, users: any, speakers: any, categories: any, tags: any, currentUserInfo: any) {
    this.id = data.id;
    if (users && data.uid) this.userInfo = users[data.uid];
    this.subject = data.subject;
    this.desc = data.desc;
    this.coverUrl = `${data.coverUrl}?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmallUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}` ;
    this.coverThumbnailUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}`;

    this.cover169Url = `${data.coverUrl}~16-9?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmall169Url =  `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverThumbnail169Url =  `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}`;

    this.cover11Url = `${data.coverUrl}~1-1?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmall11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverThumbnail11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}`;

    this.isNeedPay = data.isNeedPay;
    this.totalFee = data.totalFee;
    this.praiseTotal = data.praiseTotal;
    if (currentUserInfo) this.isPraised = currentUserInfo.praised;
    this.commentTotal = data.commentTotal;
    if (currentUserInfo) this.isFavorited = !!currentUserInfo.favoritedAt;
    this.shareTotal = data.shared;
    this.totalUsers = data.totalUsers;
    this.latestPraisedUsers = [];
    this.latestUsers = [];
    this.refLink = [];
    this.speaker = [];
    this.tags = [];
    this.categories = [];

    if (data.latestPraisedUids) {
      data.latestPraisedUids.forEach((uid: number) => {
        const user = users[uid];
        if (user) this.latestPraisedUsers.push(user)
      })
    }

    if (data.latestUserUids) {
      data.latestUserUids.forEach((uid: number) => {
        const user = users[uid];
        if (user) this.latestUsers.push(user)
      })
    }

    this.content = data.meta && data.meta.content ? data.meta.content : ''
    this.isOriginal = data.meta && data.meta.isOriginal ? data.meta.isOriginal : true
    // data.meta.mp4暂不添加, 因为有的视频是mov
    this.media = data.meta ? new TalkInfoMediaModel(data.meta.mp3, '', data.meta.mp4SD, data.meta.mp4HD, data.meta.preview, data.meta.duration) : new TalkInfoMediaModel()

    if (data.meta && data.meta.refLink && data.meta.refLink.length) {
      for (const item of data.meta.refLink) {
        this.refLink.push(new TalkInfoRefModel(item.link, item.title))
      }
    }

    if (data.meta && data.meta.speakersId && data.meta.speakersId.length && speakers) {
      for (const id of data.meta.speakersId) {
        const speaker = speakers[id];
        if (speaker) this.speaker.push(new TalkInfoSpeakerModel(speaker.id, speaker.uid, speaker.subject, speaker.desc, speaker.coverUrl))
      }
    }

    if (tags && tags.length) {
      for (const item of tags) {
        this.tags.push(item)
      }
    }

    if (categories && categories.length) {
      for (const item of categories) {
        const catalogArr = [];
        let catalog = item;

        while (catalog) {
          catalogArr.unshift(new TalkInfoCatalogModel(catalog.id, catalog.title))
          catalog = catalog.parent
        }

        this.categories.push(catalogArr)
      }
    }

    this.createdAt = moment(+data.createdAt / 1e6)
    this.updatedAt = moment(+data.updatedAt / 1e6)
    this.publishAt = moment(data.publishAt)
  }
}

export class TalkCommentParentModel {
  user: UserInfoModel;
  content: string;
  createdAt: Moment;

  constructor(userInfo: UserInfoModel, content: string, createdAt: Moment) {
    this.user = userInfo;
    this.content = content;
    this.createdAt = createdAt;
  }
}

export class TalkCommentModel {
  id: string;
  user: UserInfoModel;
  parent: TalkCommentParentModel;
  toUsers: UserInfoModel[] = [];
  content: string;
  createdAt: Moment;
  originCreatedAt: string;

  constructor(data: any, users: any) {
    this.id = data.id;
    if (users) this.user = users[data.uid];
    if (data.parent && users) this.parent = new TalkCommentParentModel(users[data.parent.uid], data.parent.content, this.createdAt = moment(+data.parent.createdAt / 1e6));
    if (data.toUids) {
      for (let uid of data.toUsers) {
        this.toUsers.push(users[uid]);
      }
    }
    this.content = data.content;
    this.createdAt = moment(+data.createdAt / 1e6);
    this.originCreatedAt = data.createdAt;

  }
}
