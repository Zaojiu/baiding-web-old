import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs";

@Injectable()
export class VideoService {
  private switchVideoSource = new Subject<boolean>();
  $switchVideo: Observable<boolean> = this.switchVideoSource.asObservable();

  constructor() {}

  switchVideo(hasGlobalPopup: boolean) {
    this.switchVideoSource.next(hasGlobalPopup);
  }
}
