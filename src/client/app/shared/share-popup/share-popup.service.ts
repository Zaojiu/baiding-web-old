import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SharePopupService {
  private popupSource = new Subject<string>();

  popup$ = this.popupSource.asObservable();

  popup() {
    this.popupSource.next('')
  }
}
