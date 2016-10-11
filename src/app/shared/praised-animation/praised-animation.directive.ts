import { Directive, ElementRef, OnInit } from '@angular/core'

declare var $: any;

@Directive({
  selector: '[praisedAnimation]'
})

export class PraisedAnimationDirective implements OnInit {
  private el: HTMLElement;

  constructor(el: ElementRef) { this.el = el.nativeElement }

  ngOnInit() {
    $(this.el).on('webkitAnimationEnd animationend', '.animation', function(e) {
      if (e.originalEvent.animationName === 'praised-animations-y' || e.originalEvent.animationName === 'mine-praised-animations-y') {
        $(this).remove();
      }
    });
  }
}
