import { Directive, ElementRef, OnInit } from '@angular/core'

declare var $:any

@Directive({
  selector: '[autofocus]'
})

export class AutofocusDirective implements OnInit {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement
  }

  ngOnInit() {
    setTimeout(()=>{
      $(this.el).focus();
    }, 500);
  }
}
