interface Store {
  set(key: string, value: any);
  get(key: string): any;
  delete(key: string);
}

class MemoryStore implements Store {
  private store = {};

  set(key: string, value: any) {
    this.store[key] = value;
  }

  get(key: string): any {
    return this.store[key];
  }

  delete(key: string) {
    delete this.store[key];
  }
}

class LocalStore implements Store {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value) || 'null');
  }

  get(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }
}

export class StoreService {
  static memoryStore: Store = new MemoryStore();
  static localStore: Store = new LocalStore();

  constructor () {}

  static set(key: string, value: any) {
    StoreService.memoryStore.set(key, value);
  }

  static get(key: string): any {
    return StoreService.memoryStore.get(key);
  }

  static delete(key: string) {
    return StoreService.memoryStore.delete(key);
  }
}
