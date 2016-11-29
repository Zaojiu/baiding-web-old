import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef,
}      from '@angular/core';
import {ToolTipsModel} from "./tooltips.model";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {UtilsService} from "../utils/utils";

declare var $: any;

@Component({
  selector: 'tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss'],
  // 此处应开启 ViewEncapsulation.None, 防止外部注入的html没有namespace, 无法应用css样式。
  // 但由于angular2 compiler的bug, 开启之后aot编译会出错。相关pr: https://github.com/angular/angular/issues/11408
  // 临时解决方案, 把样式写进全局的css样式里, 避开angular2的css namespace编译。
  // encapsulation: ViewEncapsulation.None
})

export class ToolTipsComponent implements OnChanges {
  @Input() isOpened: boolean;
  @Output() isOpenedChange = new EventEmitter<boolean>();
  @Input() items: ToolTipsModel[];
  @Output() itemSelected = new EventEmitter<ToolTipsModel>();
  $el: any;
  safeContent: {[key: string]: SafeHtml};

  constructor(private sanitizer: DomSanitizer, el: ElementRef) {
    this.$el = $(el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    let isOpenedChange = changes['isOpened'];
    let items = changes['items'];

    if (items && items.currentValue) {
      let _items = items.currentValue;
      let safeContent = {};

      for (let item of _items) {
        safeContent[item.id] = this.getTrustedContent(item.content);
      }

      this.safeContent = safeContent;
    }

    if (isOpenedChange) {
      let event = 'touchstart.tooltips';

      if (!UtilsService.hasTouchEvent) event = 'mousedown.tooltips';

      if (isOpenedChange.currentValue === true) {
        $('body').on(event, (e: Event) => {
          // 点在tooltips外,关闭tooltips。点在tooltips中的,由调用者控制关闭。
          let hasParent = false;

          if ($(e.target).is(this.$el)) {
            hasParent = true;
          } else {
            let $self = this.$el;
            $(e.target).parents().each(function() {
              if ($(this).is($self)) hasParent = true;
            });
          }

          if (!hasParent) {
            this.close();
            $('body').off(event);
            e.stopPropagation();
          }
        });
      } else if (isOpenedChange.currentValue === false) {
        $('body').off(event);
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
