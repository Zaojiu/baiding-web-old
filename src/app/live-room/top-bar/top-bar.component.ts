import {Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChildren, QueryList} from '@angular/core';
import {SharePopupService} from "../../shared/share-popup/share-popup.service";
import {TimelineService} from "../timeline/timeline.service";
import {Subscription} from "rxjs";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {FadeDirective} from "../../shared/animation/fade/fade.directive";

declare var $: any;

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})

export class TopBarComponent implements OnInit, OnDestroy {
  @Input() isCommentOpened: boolean;
  @Output() isCommentOpenedChange = new EventEmitter<boolean>();
  @Input() onlineCount: number;
  @Input() isTimelineOnOldest: boolean;
  @Input() isTimelineOnLatest: boolean;
  @ViewChildren(FadeDirective) oldestLatestBtns: QueryList<FadeDirective>;;
  isGotoOldestShown = false;
  isGotoLatestShown = false;
  timelineScrollSub: Subscription;
  originTop: number;
  distance = 200;

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
    this.oldestLatestBtns.first.fadeIn();

    setTimeout(() => {
      if (this.isGotoOldestShown) this.hideGotoOldest();
    }, 3000);
  }

  hideGotoOldest() {
    this.oldestLatestBtns.first.fadeOut().then(() => {
      this.originTop = 0;
      this.isGotoOldestShown = false;
    });
  }

  // 点击隐藏或自动隐藏
  showGotoLatest() {
    this.isGotoLatestShown = true;
    this.oldestLatestBtns.last.fadeIn();

    setTimeout(() => {
      if (this.isGotoLatestShown) this.hideGotoLatest();
    }, 3000);
  }

  // 点击隐藏或自动隐藏
  hideGotoLatest() {
    this.oldestLatestBtns.last.fadeOut().then(() => {
      this.isGotoLatestShown = false;
      this.originTop = 0;
    });
  }

  gotoOldest() {
    this.hideGotoOldest();

    if (!this.isTimelineOnOldest) {
      this.timelineService.gotoFirstMessage();
    }
  }

  gotoLatest() {
    this.hideGotoLatest();

    if (!this.isTimelineOnLatest) {
      this.timelineService.gotoLastMessage();
    }
  }

  toggleComment(isOpened: boolean) {
    this.isCommentOpenedChange.emit(isOpened);
  }

  popupShare() {
    this.sharePopupService.popup();
  }
}
