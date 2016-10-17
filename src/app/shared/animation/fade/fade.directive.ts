import { Directive, ElementRef } from '@angular/core';
declare var $:any;

@Directive({
  selector: '[fade]',
})

export class FadeDirective {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  fadeIn(duration = 0.5): Promise<Event> {
    return new Promise((resolve, reject) => {
      let $this = $(this.el);

      $this.css({
        'display': 'block',
        'transition': `opacity ${duration}s`,
        'opacity': 0,
      });

      setTimeout(() => {
        $this.one('transitionend', function (e) {
          $this.css({
            'opacity': '',
          });

          resolve(e);
        });

        $this.css('opacity', 1);
      }, 0);
    });
  }

  fadeOut(duration = 0.5): Promise<Event> {
    return new Promise((resolve, reject) => {
      let $this = $(this.el);

      $this.css({
        'display': 'block',
        'transition': `opacity ${duration}s`,
        'opacity': 1,
      });

      setTimeout(() => {
        $this.one('transitionend', function (e) {
          $this.css({
            'opacity': '',
            'display': 'none',
          });

          resolve(e);
        });

        $this.css('opacity', 0);
      }, 0);
    });
  }
}
