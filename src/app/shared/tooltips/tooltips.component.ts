import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef,
  ViewEncapsulation
}      from '@angular/core';
import {ToolTipsModel} from "./tooltips.model";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

declare var $: any;

@Component({
  selector: 'tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ToolTipsComponent implements OnChanges {
  @Input() isOpened: boolean;
  @Output() isOpenedChange = new EventEmitter<boolean>();
  @Input() items: ToolTipsModel[];
  @Output() itemSelected = new EventEmitter<ToolTipsModel>();
  $el: any;

  constructor(private sanitizer: DomSanitizer, el: ElementRef) {
    this.$el = $(el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    let isOpenedChange = changes['isOpened'];

    if (isOpenedChange) {
      if (isOpenedChange.currentValue === true) {
        $('body').on('touchstart.tooltips', (e: Event) => {
          // 点在tooltips外,关闭tooltips。点在tooltips中的,由调用者控制关闭。
          let hasParent = false;

          if ($(e.target).is(this.$el)) {
            hasParent = true;
          } else {
            $(e.target).parents().each(function () {
              if ($(this).is(this.$el)) {
                hasParent = true;
              }
            });
          }

          if (!hasParent) {
            this.close();
          }
        });
      } else if (isOpenedChange.currentValue === false) {
        $('body').off('touchstart.tooltips');
      }
    }
  }

  getTrustedContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  selectItem(item: ToolTipsModel) {
    this.itemSelected.emit(item);
  }

  close() {
    this.isOpened = false;
    this.isOpenedChange.emit(false);
  }
}
