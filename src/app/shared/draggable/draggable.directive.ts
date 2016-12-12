import {Directive, ElementRef, Renderer, OnDestroy, OnInit} from '@angular/core';
import {UtilsService} from "../utils/utils";


@Directive({
  selector: '[draggable]',
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(drag)': 'onDrag($event)',
    '(touchstart)': 'touchStart($event)',
    '(touchmove)': 'touchMove($event)',
    '(touchend)': 'touchEnd($event)',
  }
})
export class Draggable implements OnDestroy, OnInit {
  private Δx: number = 0;
  private Δy: number = 0;
  private mustBePosition: Array<string> = ['absolute', 'fixed', 'relative'];
  touchMODE: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) {
    try {
      if (this.mustBePosition.indexOf(this.el.nativeElement.style.position) === -1) {
        console.warn(this.el.nativeElement, 'Must be having position attribute set to ' + this.mustBePosition.join('|'));
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  ngOnInit(): void {
    this.touchMODE = !!UtilsService.hasTouchEvent;
    let offsetX = UtilsService.getStorage('draggableLeft');
    let offsetY = UtilsService.getStorage('draggableTop');

    // if pc,set element draggable
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'true');

    // restore position
    if (offsetX) {
      this.renderer.setElementStyle(this.el.nativeElement, 'left', offsetX + 'px');
    }

    if (offsetY) {
      this.renderer.setElementStyle(this.el.nativeElement, 'top', offsetY + 'px');
    }
  }

  // PC events
  onDragStart(event: MouseEvent) {
    if (!this.touchMODE) {
      this.Δx = event.x - this.el.nativeElement.offsetLeft;
      this.Δy = event.y - this.el.nativeElement.offsetTop;
    }
  }

  onDrag(event: MouseEvent) {
    if (!this.touchMODE) {
      this.doTranslation(event.x, event.y);
    }
  }

  onDragEnd(event: MouseEvent) {
    if (!this.touchMODE) {
      this.Δx = 0;
      this.Δy = 0;
      UtilsService.setStorage('draggableTop', this.el.nativeElement.offsetTop);
      UtilsService.setStorage('draggableLeft', this.el.nativeElement.offsetLeft);
    }
  }

  // Mobile events
  touchStart(event: TouchEvent) {
    this.Δx = event.touches[0].clientX - this.el.nativeElement.offsetLeft;
    this.Δy = event.touches[0].clientY - this.el.nativeElement.offsetTop;
  }

  touchMove(event: TouchEvent) {
    this.doTranslation(event.touches[0].clientX, event.touches[0].clientY);
  }

  touchEnd(event: TouchEvent) {
    this.Δx = 0;
    this.Δy = 0;
    UtilsService.setStorage('draggableTop', this.el.nativeElement.offsetTop);
    UtilsService.setStorage('draggableLeft', this.el.nativeElement.offsetLeft);
  }

  doTranslation(x: number, y: number) {
    if (!x || !y) return;
    this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }

  ngOnDestroy(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'false');
  }

}

