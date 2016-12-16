import {Directive, ElementRef, AfterViewInit, OnInit, OnDestroy} from '@angular/core'
import * as autosize from "autosize";
import {Subscription} from "rxjs";
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[autoresize][ngModel]'
})

export class AutoresizeDirective implements AfterViewInit, OnInit, OnDestroy {
  private el: HTMLElement;
  private valueChangeSub: Subscription;

  constructor(private formControl: NgControl, el: ElementRef) {
    this.el = el.nativeElement
  }

  ngOnInit() {
    this.valueChangeSub = this.formControl.control.valueChanges.subscribe(() => {
      setTimeout(() => this.resize(), 0);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => autosize(this.el), 0);
  }

  ngOnDestroy() {
    this.valueChangeSub.unsubscribe();
  }

  resize() {
    const evt = new Event('autosize:update');
    this.el.dispatchEvent(evt);
  }
}
