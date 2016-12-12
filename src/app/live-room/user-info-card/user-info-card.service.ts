import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import { UserPublicInfoModel} from "../../shared/api/user-info/user-info.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserInfoCardService {
  private popupSource = new Subject<UserPublicInfoModel>();

  popup$: Observable<UserPublicInfoModel> = this.popupSource.asObservable();

  popup(msg: UserPublicInfoModel ) {
    this.popupSource.next(msg);
  }
}
