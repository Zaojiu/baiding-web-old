export class ScaleEvent {
  originWidth: number;
  originHeight: number;
  isScaling: boolean;

  startScale(originWidth: number, originHeight: number): void {
    this.originWidth = originWidth;
    this.originHeight = originHeight;
    this.isScaling = true;
  }

  stopScale(newWidth: number, newHeight: number): void {
    this.originWidth = newWidth;
    this.originHeight = newHeight;
    this.isScaling = false;
  }
}
