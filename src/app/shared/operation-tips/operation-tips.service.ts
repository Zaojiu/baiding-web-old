import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class OperationTipsService {
  private popupSource = new Subject<string>();
  popup$ = this.popupSource.asObservable();

  popup(tips: string) {
    this.popupSource.next(tips);
  }
}
