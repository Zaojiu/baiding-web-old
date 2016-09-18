import { Directive, ElementRef, OnInit, Output, EventEmitter } from '@angular/core'

declare var $:any

@Directive({
  selector: '[fileSelector]'
})

export class FileSelectorDirective implements OnInit {
  private el: HTMLElement;
  files: File[] = [];
  @Output() onImgSelected = new EventEmitter<File[]>();

  constructor(el: ElementRef) {
    this.el = el.nativeElement
  }

  ngOnInit() {
    let $this = $(this.el);

    $this.on('change',() => {
      this.files = $this[0].files;
      this.onImgSelected.emit(this.files);
    })
  }
}
