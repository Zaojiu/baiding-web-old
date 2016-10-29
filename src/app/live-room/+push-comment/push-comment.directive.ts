import { Directive, ElementRef, OnInit } from '@angular/core';

import { PushCommentService } from './push-comment.service';

declare var $:any;

@Directive({
  selector: '[pushCommentScroller]'
})

export class PushCommentScrollerDirective implements OnInit {
  private el: HTMLElement;

  constructor(el: ElementRef, private pushCommentService: PushCommentService) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    const self = this;
    let $self = $(this.el);

    $self.on('scroll', function() {
      if ($self.scrollTop() < 10) {
        self.pushCommentService.notifyScrollerOnTop();
      }
      if (self.el.scrollHeight - self.el.scrollTop - self.el.clientHeight <= 10) {
        self.pushCommentService.notifyScrollerOnBottom();
      }
    });
  }
}
