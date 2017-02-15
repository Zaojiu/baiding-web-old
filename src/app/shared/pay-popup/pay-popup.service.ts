import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

@Injectable()
export class PayPopupService {
  private popupSource = new Subject<string>();
  popup$: Observable<string> = this.popupSource.asObservable();
  private setPayUrlSource = new Subject<string>();
  setPayUrl$: Observable<string> = this.setPayUrlSource.asObservable();

  popup() {
    this.popupSource.next('');
  }

  setPayUrl(payUrl: string) {
    this.setPayUrlSource.next(payUrl);
  }
}
