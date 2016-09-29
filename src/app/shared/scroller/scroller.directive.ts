import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ScrollerEventModel } from "./scroller.model";
import { ScrollerPosition } from "./scroller.enums";

declare var $:any;

@Directive({
  selector: '[scroller]'
})

export class ScrollerDirective implements OnInit {
  private el: HTMLElement;
  emiting: boolean;
  @Output() scroller = new EventEmitter<ScrollerEventModel>();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  scrollToTop() {
    let $this = $(this.el);
    $this.scrollTop(0);
  }

  scrollToBottom() {
    let $this = $(this.el);
    const top = this.el.scrollHeight-$this.height();
    $this.scrollTop(top);
  }

  startEmitScrollEvent() {
    this.emiting = true;
  }

  stopEmitScrollEvent() {
    this.emiting = false;
  }

  ngOnInit() {
    const self = this;
    let $self = $(this.el);

    $self.on('scroll', (e) => {
      if (!this.emiting) return;

      let scrollEvent = new ScrollerEventModel();
      // 记录scrollTop;
      scrollEvent.scrollTop = $self.scrollTop();

      // 记录滚动条的位置状态
      let scrollBottom = self.el.scrollHeight - self.el.scrollTop - self.el.clientHeight;
      let position: ScrollerPosition;
      if ($self.scrollTop() > 0 && $self.scrollTop() < 10) {
        position = ScrollerPosition.OnTop;
      } else if (scrollBottom > 0 && scrollBottom < 10) {
        position = ScrollerPosition.OnBottom;
      } else {
        position = ScrollerPosition.OnMiddle;
      }

      scrollEvent.position = position;

      this.scroller.emit(scrollEvent);
    });

    this.startEmitScrollEvent();
  }
}
