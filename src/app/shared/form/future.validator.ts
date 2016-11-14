import {Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';

export function futureValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    let time: string = control.value;
    let timeParsed = moment(`${time}:00`).local();
    let validSize = true;

    if (timeParsed.isValid()) {
      validSize = timeParsed.isSameOrAfter(moment());
    }

    return validSize ? null : {'future': {time}};
  };
}

@Directive({
  selector: 'input[type=datetime-local][future][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => FutureDirective), multi: true}],
})
export class FutureDirective implements Validator {
  private valFn = futureValidator();

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}
