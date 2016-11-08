import {Directive, Input, OnChanges, SimpleChanges, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

export function sizeValidator(size: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const files: File[] = control.value;
    let validSize = true;
    if (files && files.length) {
      validSize = files[0].size / 1024 / 1024 <= size;
    }
    return validSize ? null : {'size': {files}};
  };
}

@Directive({
  selector: 'input[type=file][size][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => FileSelectorSizeDirective), multi: true}],
})
export class FileSelectorSizeDirective implements Validator, OnChanges {
  @Input() size: number;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['size'];
    if (change) {
      this.valFn = sizeValidator(change.currentValue);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}

export function typeValidator(accept: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const files: File[] = control.value;
    let correctType = true;
    if (files && files.length) {
      correctType = accept.test(files[0].type);
    }
    return correctType ? null : {'accept': {files}};
  };
}

@Directive({
  selector: 'input[type=file][accept][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => FileSelectorTypeDirective), multi: true}],
})
export class FileSelectorTypeDirective implements Validator, OnChanges {
  @Input() accept: RegExp;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['accept'];
    if (change) {
      this.valFn = typeValidator(change.currentValue);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}
