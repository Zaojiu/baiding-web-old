interface StoreInterface {
  set(key: string, value: any): void;

  get(key: string): any;

  delete(key: string): void;
}

class MemoryStore implements StoreInterface {
  private store: { [key: string]: any } = {};

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

class LocalStore implements StoreInterface {
  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value) || 'null');
    } catch (e) {
    }
  }

  get(key: string): any {
    const str = localStorage.getItem(key);
    if (typeof str !== 'string') return null;
    return JSON.parse(str);
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }
}

export class Store {
  static memoryStore: StoreInterface = new MemoryStore();
  static localStore: StoreInterface = new LocalStore();

  constructor() {
  }

  static set(key: string, value: any) {
    Store.memoryStore.set(key, value);
  }

  static get(key: string): any {
    return Store.memoryStore.get(key);
  }

  static delete(key: string) {
    return Store.memoryStore.delete(key);
  }
}
