import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class TitleService {
  private titleSource = new Subject<string>();

  title$ = this.titleSource.asObservable();

  constructor () {}

  set(value: string) {
    this.titleSource.next(value);
  }
}
