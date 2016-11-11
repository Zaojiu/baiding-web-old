import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

@Injectable()
export class TextPopupService {
  private popupSource = new Subject<string>();

  popup$ = this.popupSource.asObservable();

  popup(text: string) {
    this.popupSource.next(text);
  }
}
