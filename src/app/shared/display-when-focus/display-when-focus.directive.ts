import {Directive} from '@angular/core'
import {UtilsService} from "../utils/utils";

@Directive({
  selector: 'input[display-when-focus], textarea[display-when-focus]',
  host: {'(focus)': 'onFocus()'},
})

export class DisplayWhenFocusDirective {
  constructor() {}

  onFocus() {
    UtilsService.resetWindowScroll();
  }
}
