export abstract class ImageBridge {
  abstract chooseImages():Promise<string[]|File[]>;
  abstract uploadImage(data: string):Promise<string>;
}
