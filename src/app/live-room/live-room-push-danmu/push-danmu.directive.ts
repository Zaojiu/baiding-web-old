import { Directive, ElementRef, OnInit } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { LiveRoomPushDanmuService } from './live-room-push-danmu.service';

declare var $:any;

@Directive({
  selector: '[pushDanmuScroller]'
})

export class PushDanmuScrollerDirective implements OnInit {
  private el: HTMLElement;

  constructor(el: ElementRef, private pushDanmuService: LiveRoomPushDanmuService) {
    this.el = el.nativeElement
  }

  ngOnInit() {
    const self = this;
    let $self = $(this.el);

    $self.on('scroll', function(e) {
      if ($self.scrollTop() < 10) {
        self.pushDanmuService.notifyScrollerOnTop();
      }
      if (self.el.scrollHeight - self.el.scrollTop - self.el.clientHeight < 10) {
        self.pushDanmuService.notifyScrollerOnBottom();
      }
    });
  }
}
