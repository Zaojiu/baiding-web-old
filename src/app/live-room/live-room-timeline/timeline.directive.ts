import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { LiveRoomTimelineService } from './live-room-timeline.service';

declare var $:any;

@Directive({
  selector: '[timelineScroller]'
})

export class TimelineScrollerDirective implements OnInit, OnDestroy {
  private el: HTMLElement;
  private timelineService: LiveRoomTimelineService;
  private scrollToSubscription: Subscription;

  constructor(el: ElementRef, timelineService: LiveRoomTimelineService) {
    this.el = el.nativeElement
    this.timelineService = timelineService;
  }

  scrollToTop() {
    let $this = $(this.el);
    $this.scrollTop(0);
  }

  scrollToBottom() {
    let $this = $(this.el);
    const top = this.el.scrollHeight-$this.height();
    $this.scrollTop(top);
  }

  ngOnInit() {
    const self = this;
    let $self = $(this.el);

    $self.on('scroll', function(e) {
      if ($self.scrollTop() < 10) {
        self.timelineService.notifyScrollerOnTop();
      }
      if (self.el.scrollHeight - self.el.scrollTop - self.el.clientHeight < 10) {
        self.timelineService.notifyScrollerOnBottom();
      }
    });

    this.scrollToSubscription = this.timelineService.scrollTo$.subscribe(
      topOrBottom => {
        if ( topOrBottom ) {
          this.scrollToTop();
        } else {
          this.scrollToBottom();
        }
      }
    );
  }

  ngOnDestroy() {
    this.scrollToSubscription.unsubscribe();
  }
}
