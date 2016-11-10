import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import { UserPublicInfoModel} from "../../shared/api/user-info/user-info.model";

@Injectable()
export class EditorCardService {
  private popupSource = new Subject<UserPublicInfoModel>();

  popup$ = this.popupSource.asObservable();

  popup(msg: UserPublicInfoModel ) {
    this.popupSource.next(msg);
  }
}
