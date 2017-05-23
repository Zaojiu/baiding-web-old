import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {ModalService} from './modal.service';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  content: SafeHtml;
  cancelText: string;
  confirmText: string;
  hasCancelBtn: boolean;
  resolver: any;
  isOpened: boolean;
  routerSubscription: Subscription;

  constructor(private router: Router, private ModalService: ModalService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。
    this.ModalService.needPopup$.subscribe(
      ctx => {
        if (this.isOpened)return ctx.resolver(false);
        this.content = this.sanitizer.bypassSecurityTrustHtml(ctx.content);
        this.cancelText = ctx.cancelText;
        this.confirmText = ctx.confirmText;
        this.hasCancelBtn = ctx.hasCancelBtn;
        this.resolver = ctx.resolver;
        this.isOpened = true;
      }
    );

    this.ModalService.needClose$.subscribe(
      () => {
        if (!this.isOpened || !this.resolver) return

        this.isOpened = false;
        this.resolver(false);
      }
    );

    // 监控router变化，如果route换了，那么关闭全局弹出层
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          if (this.isOpened) this.ModalService.close();
        }
      }
    );
  }


  close() {
    this.ModalService.close();
  }

  confirm() {
    this.isOpened = false;
    this.resolver(true);
  }
}
