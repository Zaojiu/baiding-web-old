import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
  private memoryStore: any;

  constructor () {}

  set(key: string, value: any) {
    this.memoryStore[key] = value;
  }

  get(key: string): any {
    return this.memoryStore[key];
  }
}
