export class ObjectModel {
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

  constructor(data: any) {
    this.id = data.id;
    this.subject = data.subject;
    this.desc = data.desc;
    this.coverUrl = `${data.coverUrl}?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmallUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/1125x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}` : ''; // for ios 375 * 3
    this.coverThumbnailUrl = data.coverUrl ? `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}` : '';

    this.cover169Url = `${data.coverUrl}~16-9?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmall169Url = data.coverUrl ? `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/1125x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}` : ''; // for ios 375 * 3
    this.coverThumbnail169Url = data.coverUrl ? `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}` : '';

    this.cover11Url = `${data.coverUrl}~1-1?updatedAt=${Math.round(+data.updatedAt)}`;
    this.coverSmall11Url = data.coverUrl ? `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/1125x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}` : ''; // for ios 375 * 3
    this.coverThumbnail11Url = data.coverUrl ? `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x>/format/jpg/interlace/1&updatedAt=${Math.round(+data.updatedAt)}` : '';
  }
}
