import { Directive, ElementRef, OnInit } from '@angular/core'

declare var $:any;

@Directive({
  selector: '[autofocus-first-invalid-input]'
})

export class AutofocusFirstInvalidInputDirective implements OnInit {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    $(this.el).on('submit', function () {
      $(this.el).find('input.ng-invalid:first').first().focus();
    });
  }
}


