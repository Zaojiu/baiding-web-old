import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {SharePopupService} from "../../shared/share-popup/share-popup.service";
import {TimelineService} from "../timeline/timeline.service";
import {Subscription} from "rxjs";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})

export class TopBarComponent implements OnInit, OnDestroy {
  @Input() isCommentOpened: boolean;
  @Input() onlineCount: number;
  @Output() isCommentOpenedChange = new EventEmitter<boolean>();
  isGotoOldestShown = false;
  isGotoLatestShown = false;
  timelineScrollSub: Subscription;
  originTop: number;
  distance = 300;

  constructor(private sharePopupService: SharePopupService, private timelineService: TimelineService) {
  }

  ngOnInit() {
    this.timelineScrollSub = this.timelineService.scroll$.subscribe((e) => {
      this.switchBtn(e);
    });
  }

  ngOnDestroy() {
    this.timelineScrollSub.unsubscribe();
  }

  switchBtn(e: ScrollerEventModel) {
    if (!this.originTop) {
      this.originTop = e.scrollTop;
      return
    }

    let shouldShowGoToOldest = this.originTop - e.scrollTop > this.distance && !this.isGotoOldestShown && !this.isGotoLatestShown;
    if (shouldShowGoToOldest) {
      this.showGotoOldest();
      return
    }

    let shouldShowGoToLatest = e.scrollTop - this.originTop > this.distance && !this.isGotoOldestShown && !this.isGotoLatestShown;
    if (shouldShowGoToLatest) {
      this.showGotoLatest();
      return
    }
  }

  showGotoOldest() {
    this.isGotoOldestShown = true;
    $('.oldest-btn').fadeIn();

    setTimeout(() => {
      this.isGotoOldestShown = false;
      $('.oldest-btn').fadeOut();
      this.originTop = 0;
    }, 5000);
  }

  showGotoLatest() {
    this.isGotoLatestShown = true;
    $('.latest-btn').fadeIn();

    setTimeout(() => {
      this.isGotoLatestShown = false;
      $('.latest-btn').fadeOut();
      this.originTop = 0;
    }, 5000);
  }

  gotoOldest() {
    this.timelineService.gotoFirstMessage();
  }

  gotoLatest() {
    this.timelineService.gotoLastMessage();
  }

  toggleComment(isOpened: boolean) {
    this.isCommentOpenedChange.emit(isOpened);
  }

  popupShare() {
    this.sharePopupService.popup();
  }
}
