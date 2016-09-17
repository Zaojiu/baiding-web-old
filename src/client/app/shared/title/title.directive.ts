import { Directive, ElementRef, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription';
import { TitleService } from './title.service'

declare var $:any

@Directive({
  selector: '[titleSetter]'
})

export class TitleSetterDirective implements OnInit {
  private el: HTMLElement;
  private titleSubscription: Subscription;

  constructor(el: ElementRef, private titleService: TitleService) {
    this.el = el.nativeElement
  }

  ngOnInit() {
    this.titleSubscription = this.titleService.title$.subscribe(
      title => {
        document.title = title
        const iframe = $('<iframe style="position:absolute;left:-1000000px;top:-10000000px;" src="/"></iframe>')[0]
        const listener = () => {
          setTimeout(() => {
            iframe.removeEventListener('load', listener);
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 0)
          }, 0)
        }
        iframe.addEventListener('load', listener);
        document.body.appendChild(iframe)
      }
    )
  }
}
