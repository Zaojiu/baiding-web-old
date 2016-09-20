import {Directive, ElementRef, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core'
declare var $: any

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
    let maxSize = 1024 * 1024 * 8;
    $this.on('change', () => {
      if($this[0].files.length){
        let fileSize = $this[0].files[0].size;
        let file = $this[0].value;
       if(!/.(gif|jpg|jpeg|png|bmp)$/.test(file)){
          alert("图片不符合类型")
          return false
        } else if(fileSize>maxSize){
          alert("图片超过尺寸大小")
          return false
        }
      }
      this.files = $this[0].files;
      this.onImgSelected.emit(this.files);
    })
  }
}
