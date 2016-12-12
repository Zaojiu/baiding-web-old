export class StoreService {
  static memoryStore = {};

  constructor () {}

  static set(key: string, value: any) {
    this.memoryStore[key] = value;
  }

  static get(key: string): any {
    return this.memoryStore[key];
  }
}
