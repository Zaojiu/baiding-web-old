import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

import {ModalService} from '../../shared/modal/modal.service';

export interface QuitEditGuardComponent {
  canDeactivate(): boolean;
}

@Injectable()
export class QuitEditGuard implements CanDeactivate<QuitEditGuardComponent> {
  constructor(private modalService: ModalService) {}

  canDeactivate(component: QuitEditGuardComponent): Promise<boolean> {
    if (component.canDeactivate()) return Promise.resolve(true);
    return this.modalService.popup('您的内容未保存,确定退出吗?', '取消', '退出')
  }
}
