import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';
import {Observable} from "rxjs/Observable";

import {ModalContext, ModalLink}    from './modal.model';

@Injectable()
export class ModalService {
  private popupSource = new Subject<ModalContext>();
  private closeSource = new Subject<string>();

  needPopup$: Observable<ModalContext> = this.popupSource.asObservable();
  needClose$: Observable<string> = this.closeSource.asObservable();
  isOpened = true;

  popup(content: string, cancelText = '取消', confirmText = '确定', hasCancelBtn = true, confirmLink?: ModalLink): Promise<boolean> {
    let ctx = new ModalContext(content, cancelText, confirmText, hasCancelBtn, confirmLink);
    let promise = new Promise((resolve)=> {
      ctx.resolver = resolve;
      this.popupSource.next(ctx);
    });

    this.isOpened = false;

    return promise;
  }

  close() {
    this.closeSource.next('');
    this.isOpened = true;
  }
}
