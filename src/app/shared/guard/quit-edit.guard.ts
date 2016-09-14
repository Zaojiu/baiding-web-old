import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

import {ModalService} from '../../shared/modal/modal.service';

@Injectable()
export class QuitEditGuard implements CanDeactivate<void> {
  constructor(private modalService: ModalService) {}

  canDeactivate(): Promise<boolean> {
    return this.modalService.popup('退出此次编辑', '取消', '退出')
  }
}

