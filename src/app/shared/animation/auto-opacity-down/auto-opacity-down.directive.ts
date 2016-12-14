import {Directive, ElementRef} from '@angular/core';
declare var $: any;

@Directive({
  selector: '[auto-opacity-down]',
})

export class AutoOpacityDownDirective {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  opacityDown(duration = 0.5): Promise<Event> {
    return new Promise((resolve, reject) => {
      let $this = $(this.el);

      $this.css({
        'transition': `opacity ${duration}s`,
        'opacity': '.2',
      });

      setTimeout(() => {
        $this.one('transitionend', function (e) {
          $this.css({
            'opacity': '.2',
          });
          resolve(e);
        });
      }, 0);
    });
  }

  opacityUp(duration = 0.5): Promise<Event> {
    return new Promise((resolve, reject) => {
      let $this = $(this.el);

      $this.css({
        'transition': `opacity ${duration}s`,
        'opacity': '1',
      });

      setTimeout(() => {
        $this.one('transitionend', function (e) {
          $this.css({
            'opacity': '1',
          });
          resolve(e);
        });
      }, 0);
    });
  }
}
