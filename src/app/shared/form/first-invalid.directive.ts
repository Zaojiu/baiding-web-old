import { Directive, ElementRef } from '@angular/core'

declare var $:any;

@Directive({
  selector: 'form[autofocus-first-invalid-input]',
  host: {'(submit)': 'findFirstInvalidField()'},
})

export class AutofocusFirstInvalidInputDirective {
  private $el: any;

  constructor(el: ElementRef) {
    this.$el = $(el.nativeElement);
  }

  findFirstInvalidField() {
    this.$el.find('input.ng-invalid:first').first().focus();
  }
}


