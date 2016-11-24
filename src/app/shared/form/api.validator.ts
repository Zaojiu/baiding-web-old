import {AbstractControl, AsyncValidatorFn, NG_ASYNC_VALIDATORS, Validator} from '@angular/forms';
import {forwardRef, Directive, Input} from "@angular/core";

export function apiValidator(apiCall: (val: string) => Promise<void>): AsyncValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    let val: string = control.value;

    return new Promise((resolve, reject) => {
      apiCall(val).then(() => {
        resolve(null);
      }, () => {
        resolve({api: val});
      });
    });
  };
}

@Directive({
  selector: '[api][ngModel]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ApiValidatorDirective), multi: true}],
})
export class ApiValidatorDirective implements Validator {
  @Input() apiFn: (val: string) => Promise<void>;
  private valFn = apiValidator(this.apiFn);

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}
