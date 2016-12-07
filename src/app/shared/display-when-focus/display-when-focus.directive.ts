import {Directive, ElementRef, AfterViewInit, OnDestroy} from '@angular/core'
import {UtilsService} from "../utils/utils";

declare var $: any;

@Directive({
  selector: '[display-when-focus]'
})

export class DisplayWhenFocusDirective implements AfterViewInit, OnDestroy {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement
  }

  ngAfterViewInit() {
    $(this.el).on('focus', () => {
      UtilsService.resetWindowScroll();
    });
  }

  ngOnDestroy() {
    $(this.el).off('focus');
  }
}
