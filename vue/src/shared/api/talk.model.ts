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

  publishAtParsed: Moment;
  publishAt: string;
  createdAtParsed: Moment;
  createdAt: string;
  updatedAtParsed: Moment;
  updatedAt: string;

  constructor(data: any) {
    if (!data) return;

    const object = data.object || {};
    const users = data.users || {};
    const speakers = data.speakers || [];
    const categories = data.categories || [];
    const tags = data.tags || [];
    const currentUserInfo = data.currentUserInfo || {};

    this.id = object.id;
    if (users && object.uid) this.userInfo = users[object.uid];
    this.subject = object.subject;
    this.desc = object.desc;
    this.coverUrl = object.coverUrl;
    this.coverSmallUrl = `${object.coverUrl}?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnailUrl = `${object.coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;

    this.cover169Url = `${object.coverUrl}~16-9`;
    this.coverSmall169Url = `${object.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnail169Url = `${object.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;

    this.cover11Url = `${object.coverUrl}~1-1`;
    this.coverSmall11Url = `${object.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x>/format/jpg/interlace/1`;
    this.coverThumbnail11Url = `${object.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1`;

    this.isNeedPay = object.isNeedPay;
    this.totalFee = object.totalFee;
    this.praiseTotal = object.praiseTotal;
    if (currentUserInfo) this.isPraised = currentUserInfo.praised;
    this.commentTotal = object.commentTotal;
    if (currentUserInfo) this.isFavorited = !!currentUserInfo.favoritedAt;
    this.shareTotal = object.shared;
    this.totalUsers = object.totalUsers;
    this.latestPraisedUsers = [];
    this.latestUsers = [];
    this.refLink = [];
    this.speaker = [];
    this.tags = [];
    this.categories = [];

    if (object.latestPraisedUids) {
      object.latestPraisedUids.forEach((uid: number) => {
        const user = users[uid];
        if (user) this.latestPraisedUsers.push(user)
      })
    }

    if (object.latestUserUids) {
      object.latestUserUids.forEach((uid: number) => {
        const user = users[uid];
        if (user) this.latestUsers.push(user)
      })
    }

    this.content = object.meta && object.meta.content ? object.meta.content : '';
    this.isOriginal = object.meta && object.meta.isOriginal ? object.meta.isOriginal : true
    // object.meta.mp4暂不添加, 因为有的视频是mov
    this.media = object.meta ? new TalkInfoMediaModel(object.meta.mp3, '', object.meta.mp4SD, object.meta.mp4HD, object.meta.preview, object.meta.duration) : new TalkInfoMediaModel()

    if (object.meta && object.meta.refLink && object.meta.refLink.length) {
      for (const item of object.meta.refLink) {
        this.refLink.push(new TalkInfoRefModel(item.link, item.title))
      }
    }

    if (object.meta && object.meta.speakersId && object.meta.speakersId.length && speakers) {
      for (const id of object.meta.speakersId) {
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

    this.createdAtParsed = moment(+object.createdAt / 1e6);
    this.createdAt = object.createdAt;
    this.updatedAtParsed = moment(+object.updatedAt / 1e6);
    this.updatedAt = object.updatedAt;
    this.publishAtParsed = moment(object.publishAt);
    this.publishAt = object.publishAt;
  }
}

export class TalkCommentParentModel {
  user: UserInfoModel;
  content: string;
  createdAtParsed: Moment;

  constructor(userInfo: UserInfoModel, content: string, createdAtParsed: Moment) {
    this.user = userInfo;
    this.content = content;
    this.createdAtParsed = createdAtParsed;
  }
}

export class TalkCommentModel {
  id: string;
  user: UserInfoModel;
  parent: TalkCommentParentModel;
  toUsers: UserInfoModel[] = [];
  content: string;
  createdAtParsed: Moment;
  createdAt: string;

  constructor(data: any, users: any) {
    this.id = data.id;
    if (users) this.user = users[data.uid];
    if (data.parent && users) {
      this.parent = new TalkCommentParentModel(users[data.parent.uid], data.parent.content, moment(+data.parent.createdAt / 1e6));
    }
    if (data.toUids) {
      for (let uid of data.toUsers) {
        this.toUsers.push(users[uid]);
      }
    }
    this.content = data.content;
    this.createdAtParsed = moment(+data.createdAt / 1e6);
    this.createdAt = data.createdAt;
  }
}

export class TalkEmphasisModel {
  id: string;
  mediaId: string;
  coverUrl: string;
  createdAt: string;
  duration: number;
  start: number;
  startParsed: Duration;
  text: string;

  constructor(id: string, mediaId: string, start: number,  duration: number,text: string, coverUrl: string, createdAt: string) {
    this.id = id;
    this.mediaId = mediaId;
    this.coverUrl = coverUrl;
    this.createdAt = createdAt;
    this.duration = duration;
    this.start = start;
    this.startParsed = moment.duration(this.start);
    this.text = text;
  }
}
