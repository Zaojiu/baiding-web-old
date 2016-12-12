import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {BottomPopupSelectorModel, BottomPopupSelectorItemModel}    from './bottom-popup-selector.model';
import {Observable} from "rxjs/Observable";

@Injectable()
export class BottomPopupSelectorService {
  // Observable string sources
  private popupSource = new Subject<BottomPopupSelectorModel>();
  private itemSelectedSource = new Subject<BottomPopupSelectorItemModel>();
  private closeSource = new Subject<string>();
  // Observable string streams
  needPopup$: Observable<BottomPopupSelectorModel> = this.popupSource.asObservable();
  itemSelected$: Observable<BottomPopupSelectorItemModel> = this.itemSelectedSource.asObservable();
  needClose$: Observable<string> = this.closeSource.asObservable();
  isClosed = true;
  // Service message commands
  popup(model: BottomPopupSelectorModel) {
    this.popupSource.next(model);
    this.isClosed = false;
  }

  close() {
    this.closeSource.next('');
    this.isClosed = true;
  }

  selectItem(item: BottomPopupSelectorItemModel) {
    this.itemSelectedSource.next(item);
  }
}
