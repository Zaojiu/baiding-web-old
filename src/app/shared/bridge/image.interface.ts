export abstract class ImageBridge {
  abstract chooseImages(count?: number):Promise<string[]|File[]>;
  abstract uploadImage(data: string):Promise<string>;
}
