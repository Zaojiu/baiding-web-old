import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

import {ModalService} from '../../shared/modal/modal.service';

interface QuitEditGuardComponent {
  canDeactivate(): boolean;
}

@Injectable()
export class QuitEditGuard implements CanDeactivate<QuitEditGuardComponent> {
  constructor(private modalService: ModalService) {}

  canDeactivate(component: QuitEditGuardComponent): Promise<boolean> {
    if (component.canDeactivate()) return Promise.resolve(true);
    return this.modalService.popup('退出此次编辑', '取消', '退出')
  }
}

