import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

import {ModalContext}    from './modal.model';

@Injectable()
export class ModalService {
  private popupSource = new Subject<ModalContext>();
  private closeSource = new Subject<string>();

  needPopup$ = this.popupSource.asObservable();
  needClose$ = this.closeSource.asObservable();
  isOpened = true;

  popup(content: string, cancelText = '取消', confirmText = '确定', hasCancelBtn = true): Promise<boolean> {
    let ctx = new ModalContext(content, cancelText, confirmText, hasCancelBtn);
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
