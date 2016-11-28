import {Directive, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core'

declare var $: any;

@Directive({
  selector: '[autoblur]'
})

export class AutoBlurDirective implements OnChanges {
  private $el: any;
  private randomId = _.random(0, 100000, false);
  @Input('autoblur') isBlurred: boolean;
  @Output() blurred = new EventEmitter<void>();

  constructor(el: ElementRef) {
    this.$el = $(el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    let isBlurred = changes['isBlurred'];

    if (isBlurred) {
      if (isBlurred.currentValue) {
        $('body').off(`touchstart.blur${this.randomId} mouseup.blur${this.randomId}`);
      } else {
        $('body').on(`touchstart.blur${this.randomId}  mouseup.blur${this.randomId}`, (e: Event) => {
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
            this.blurred.emit();
          }
        });
      }
    }
  }
}

