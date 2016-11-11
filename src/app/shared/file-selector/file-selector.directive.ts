import {Directive, ElementRef, forwardRef, Renderer} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
declare var $: any;

export const FILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileControlValueAccessor),
  multi: true
};

@Directive({
  selector: 'input[type=file][formControlName],input[type=file][formControl],input[type=file][ngModel]',
  host: {'(change)': '_onChange($event)', '(blur)': 'onTouched()'},
  providers: [FILE_VALUE_ACCESSOR]
})

export class FileControlValueAccessor implements ControlValueAccessor {
  private _elementRef: ElementRef;
  private el: HTMLElement;
  private $el: any;

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  constructor(private _renderer: Renderer, _elementRef: ElementRef) {
    this._elementRef = _elementRef;
    this.el = _elementRef.nativeElement;
    this.$el = $(_elementRef.nativeElement);
  }

  _onChange(e: any) {
    this.onChange(e.target.files);
  }

  writeValue(value: any): void {
    if (!value || !value.length) {
      this.$el.wrap('<form>').closest('form').get(0).reset();
      this.$el.unwrap();
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }
}
