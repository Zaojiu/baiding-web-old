import {Directive} from '@angular/core';
import {FormControl, NgControl} from "@angular/forms";

@Directive({
  selector: 'input[validate-onblur],textarea[validate-onblur]',
  host: {'(focus)': 'onFocus($event)', '(blur)': 'onBlur()'},
})

export class ValidateOnBlurDirective {
  constructor(private formControl: NgControl) {
  }

  onFocus(e: any) {
    this.formControl.control.setErrors(null);
  }

  onBlur(e: any) {
    this.formControl.control.updateValueAndValidity(true);
  }

}
