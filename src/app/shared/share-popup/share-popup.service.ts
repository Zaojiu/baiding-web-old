import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

@Injectable()
export class SharePopupService {
  private popupSource = new Subject<string>();

  popup$: Observable<string> = this.popupSource.asObservable();

  popup(link?: string) {
    this.popupSource.next(link);
  }
}
