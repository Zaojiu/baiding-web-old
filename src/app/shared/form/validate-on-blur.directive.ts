import {Directive} from '@angular/core';
import {FormControl, NgControl} from "@angular/forms";

@Directive({
  selector: 'input[validate-onblur],textarea[validate-onblur]',
  host: {'(focus)': 'onFocus()', '(blur)': 'onBlur()'},
})

export class ValidateOnBlurDirective {
  constructor(private formControl: NgControl) {
  }

  onFocus() {
    this.formControl.control.setErrors(null);
  }

  onBlur() {
    this.formControl.control.updateValueAndValidity(true);
  }

}
