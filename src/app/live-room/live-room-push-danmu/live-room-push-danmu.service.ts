import { Injectable }     from '@angular/core';
import { Subject }        from 'rxjs/Subject';

@Injectable()
export class LiveRoomPushDanmuService {
  // Observable string sources
  private scrollerSource = new Subject<boolean>();
  // Observable string streams
  scroller$ = this.scrollerSource.asObservable();

  constructor () {}

  notifyScrollerOnTop() {
    this.scrollerSource.next(true);
  }

  notifyScrollerOnBottom() {
    this.scrollerSource.next(false);
  }
}
