import {Injectable} from '@angular/core';
import {Subject, Observable} from "rxjs";

@Injectable()
export class HistoryService {
  constructor() {
  }

  private messageRefreshSource = new Subject<void>();
  messageRefresh$: Observable<void> = this.messageRefreshSource.asObservable();

  refresh() {
    this.messageRefreshSource.next();
  }
}
