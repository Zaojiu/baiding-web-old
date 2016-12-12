import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

@Injectable()
export class TitleService {
  private titleSource = new Subject<string>();

  title$: Observable<string> = this.titleSource.asObservable();

  constructor() {
  }

  set(value: string) {
    this.titleSource.next(value);
  }
}
