import { Directive, ElementRef, Input, OnInit } from '@angular/core'
import { UserInfoModel } from '../../../shared/user-info/user-info.model'
declare var $:any

@Directive({
  selector: '[praisedAnimations]'
})

export class PraisedAnimationsDirective implements OnInit {
  @Input() praisedAnimations: UserInfoModel[];
  private el: HTMLElement;

  constructor(el: ElementRef) { this.el = el.nativeElement }

  ngOnInit() {
    const self = this;
    $(this.el).on('webkitAnimationEnd animationend', '.animation', function(e) {
      if (e.originalEvent.animationName === 'praised-animations-y' || e.originalEvent.animationName === 'mine-praised-animations-y') {
        $(this).remove();
      }
    });
  }
}
