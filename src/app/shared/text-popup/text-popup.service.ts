import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

@Injectable()
export class TextPopupService {
  private popupSource = new Subject<string>();

  popup$: Observable<string> = this.popupSource.asObservable();

  popup(text: string) {
    this.popupSource.next(text);
  }
}
