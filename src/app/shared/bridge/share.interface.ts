export abstract class ShareBridge {
  abstract share(title: string, desc: string, cover: string, link: string, liveId?: string);
}
