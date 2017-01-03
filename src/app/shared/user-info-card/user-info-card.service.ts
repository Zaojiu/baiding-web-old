import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserInfoCardService {
  private popupSource = new Subject<number>();

  popup$: Observable<number> = this.popupSource.asObservable();

  popup(uid: number) {
    this.popupSource.next(uid);
  }
}
