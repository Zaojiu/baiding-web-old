export class UtilsService {
  static now(): number {
    return Math.floor((new Date()).getTime() / 1000);
  }
}
