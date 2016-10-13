import {Directive, ElementRef, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges} from '@angular/core'
import {ModalService} from "../modal/modal.service";
declare var $: any

@Directive({
  selector: '[fileSelector]'
})

export class FileSelectorDirective implements OnInit, OnChanges {
  private el: HTMLElement;
  @Input() fileSelector: File[] = [];
  @Output() fileSelectorChange = new EventEmitter<File[]>();

  constructor(el: ElementRef, private modalService: ModalService) {
    this.el = el.nativeElement
  }

  ngOnChanges(changes: SimpleChanges) {
    let files = changes['fileSelector'];

    if (files && !files.currentValue) {
      let $this = $(this.el);
      $this.wrap('<form>').closest('form').get(0).reset();
      $this.unwrap();
    }
  }

  ngOnInit() {
    let $this = $(this.el);
    let maxSize = 1024 * 1024 * 8;
    $this.on('change', () => {
      if ($this[0].files.length) {
        let file = $this[0].value;
        let fileSize = $this[0].files[0].size;
        let fileType = $this[0].files[0].type;

        if (!/.(image\/gif|jpg|jpeg|png|bmp|raw)$/.test(fileType)) {
          this.modalService.popup("图片不符合类型", '取消', '确定', false);
          return false
        } else if (fileSize > maxSize) {
          this.modalService.popup("图片大小不能超过8M", '取消', '确定', false);
          return false
        }
      }
      this.fileSelector = $this[0].files;
      this.fileSelectorChange.emit(this.fileSelector);
    })
  }
}
