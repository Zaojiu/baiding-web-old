import {Directive, OnInit, OnDestroy} from '@angular/core';
import {NgControl} from "@angular/forms";
import {Subscription} from "rxjs";

@Directive({
  selector: 'input[ngModel],textarea[ngModel]',
  host: {'[class.ng-has-value]': 'ngClassHasValue'},
})

export class InputHasValueDirective implements OnInit, OnDestroy {
  ngClassHasValue = false;
  private valueChangeSub: Subscription;

  constructor(private formControl: NgControl) {
  }

  ngOnInit() {
    this.ngClassHasValue = this.formControl.control.value !== '' && typeof(this.formControl.control.value) !== "undefined";

    this.valueChangeSub = this.formControl.control.valueChanges.subscribe(value => {
      this.ngClassHasValue = value !== '' && typeof(value) !== "undefined";
    });
  }

  ngOnDestroy() {
    this.valueChangeSub.unsubscribe();
  }
}
