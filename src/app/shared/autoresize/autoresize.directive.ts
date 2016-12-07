import {Directive, ElementRef, AfterViewInit} from '@angular/core'
import * as autosize from "autosize";

declare var $:any;

@Directive({
  selector: '[autoresize]'
})

export class AutoresizeDirective implements AfterViewInit {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement
  }

  ngAfterViewInit () {
    autosize(this.el);

    $(this.el).on('change', () => {
      setTimeout(() => this.resize(), 0);
    });
  }

  resize() {
    const evt = new Event('autosize:update');
    this.el.dispatchEvent(evt);
  }
}
