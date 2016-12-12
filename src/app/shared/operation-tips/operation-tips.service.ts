import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

@Injectable()
export class OperationTipsService {
  private popupSource = new Subject<string>();
  popup$: Observable<string> = this.popupSource.asObservable();

  popup(tips: string) {
    this.popupSource.next(tips);
  }
}
