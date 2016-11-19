export abstract class ShareBridge {
  title: string;
  desc: string;
  cover: string;
  link: string;
  liveId?: string;

  abstract setShareInfo(title: string, desc: string, cover: string, link: string, liveId?: string);
  abstract share();
}
