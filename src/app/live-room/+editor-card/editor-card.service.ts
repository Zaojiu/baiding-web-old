import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";

@Injectable()
export class EditorCardService {
  private popupSource = new Subject<UserInfoModel>();

  popup$ = this.popupSource.asObservable();

  popup(msg: UserInfoModel ) {
    this.popupSource.next(msg);
  }
}
