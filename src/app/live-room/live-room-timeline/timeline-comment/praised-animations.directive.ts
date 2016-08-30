import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { PraisedUserModel } from './timeline-comment.model';
declare var $:any;

@Directive({
  selector: '[praisedAnimations]'
})

export class PraisedAnimationsDirective implements OnInit {
  @Input() praisedAnimations: PraisedUserModel[];
  private el: HTMLElement;

  constructor(el: ElementRef) { this.el = el.nativeElement }

  ngOnInit() {
    const self = this;
    $(this.el).on('webkitAnimationEnd animationend', '.animation', function(e) {
      if (e.originalEvent.animationName != 'mine-popup-animations') {
        self.praisedAnimations.shift();
      }
    });
  }
}
