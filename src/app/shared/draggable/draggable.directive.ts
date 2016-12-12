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
    '(mousedown)': 'mouseDown($event)',
    '(mousemove)': 'mouseMove($event)',
    '(mouseup)': 'mouseUp($event)',
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

  public ngOnInit(): void {
    console.log('into drag')
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'true');
    this.touchMODE = !!UtilsService.hasTouchEvent;
  }

  onDragStart(event: MouseEvent) {
    console.log('dragstart')
    this.Δx = event.x - this.el.nativeElement.offsetLeft;
    this.Δy = event.y - this.el.nativeElement.offsetTop;
  }

  onDrag(event: MouseEvent) {
    console.log('ondrag')
    this.doTranslation(event.x, event.y);
  }

  onDragEnd(event: MouseEvent) {
    console.log('dragend')
    this.Δx = 0;
    this.Δy = 0;
  }

  mouseDown(event: MouseEvent) {
    console.log('touchstart')
    this.Δx = event.x - this.el.nativeElement.offsetLeft;
    this.Δy = event.y - this.el.nativeElement.offsetTop;
  }

  mouseMove(event: MouseEvent) {
    console.log('touchmove')
    this.doTranslation(event.x, event.y);
  }

  mouseUp(event: MouseEvent) {
    console.log('touchend')
    this.Δx = 0;
    this.Δy = 0;
  }

  doTranslation(x: number, y: number) {
    if (!x || !y) return;
    this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }

  public ngOnDestroy(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'false');
  }

}

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
//
//
// const DRAGGABLE_DIRECTIVES: any[] = [Draggable];
//
// @NgModule({
//   imports: [CommonModule],
//   exports: DRAGGABLE_DIRECTIVES,
//   declarations: DRAGGABLE_DIRECTIVES
// })
// export class DraggableModule { }
