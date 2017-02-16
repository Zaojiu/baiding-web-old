import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

@Injectable()
export class PayPopupService {
  private switchSource = new Subject<boolean>();
  switch$: Observable<boolean> = this.switchSource.asObservable();
  private setPayUrlSource = new Subject<string>();
  setPayUrl$: Observable<string> = this.setPayUrlSource.asObservable();
  private closeSource = new Subject<string>();
  close$: Observable<string> = this.closeSource.asObservable();

  switch(status = true) {
    this.switchSource.next(status);
  }

  setPayUrl(payUrl: string) {
    this.setPayUrlSource.next(payUrl);
  }

  onClose() {
    this.closeSource.next('');
  }
}
