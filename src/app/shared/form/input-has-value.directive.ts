import {Directive, OnInit} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: 'input[ngModel],textarea[ngModel]',
  host: {'[class.ng-has-value]': 'ngClassHasValue'},
})

export class InputHasValueDirective implements OnInit {
  ngClassHasValue = false;

  constructor(private formControl: NgControl) {
  }

  ngOnInit() {
    this.formControl.control.valueChanges.subscribe(value => {
      this.ngClassHasValue = value !== '' && typeof(value) !== "undefined";
    });
  }
}
