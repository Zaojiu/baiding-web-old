import {Directive, ElementRef, Renderer, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[auto-focus]'
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
    }, 100);
  }
}
