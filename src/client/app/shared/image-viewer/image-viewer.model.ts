export class ScaleEvent {
  originWidth: number;
  originHeight: number;
  originX = 0;
  originY = 0;
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

  setOffSet(newX: number, newY: number): void {
    this.originX += newX;
    this.originY += newY;
  }
}
