import {
  Directive, ElementRef, Input, Output, EventEmitter, OnInit, DoCheck,
  AfterViewInit
} from '@angular/core';
import {ScrollerEventModel} from "./scroller.model";
import {ScrollerPosition} from "./scroller.enums";
import * as clone from "lodash/clone";
import * as _ from "lodash";

declare var $: any;

@Directive({
  selector: '[scroller]'
})

export class ScrollerDirective implements OnInit, DoCheck, AfterViewInit {
  private el: HTMLElement;
  private $el: any;
  emiting: boolean;
  @Output() scroller = new EventEmitter<ScrollerEventModel>();
  @Input() data: any[];
  @Input() dataContainerSelector: string;
  @Input() loadCount = 10;
  @Input() maxDataCount = 20;
  isHeadLoadingShown = false;
  isFootLoadingShown = false;
  private dataCache: any[];
  private dataCur: any[];
  private $dataContainer: any;
  private containerOffset = 0;
  private enterHead = false;
  private enterFoot = false;
  private touchObserving = false;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    this.$el = $(this.el);
  }

  ngAfterViewInit() {
    let position = this.$el.css('position');
    if (position !== 'relative' && position !== 'absolute' && position !== 'fixed') this.$el.css('position', 'relative');

    let $container = this.$el.find(this.dataContainerSelector);
    this.$dataContainer = $container.length ? $container : null;
    this.containerOffset = $container.length ? $container.position().top : 0;

    if ($container.length) {
      let position = $container.css('position');
      if (position !== 'relative' && position !== 'absolute' && position !== 'fixed') $container.css('position', 'relative');
    }
  }

  ngDoCheck() {
    if (this.checkDataModifiedOutside()) {
      throw new Error('Do not modify data outside scroller directive');
    }
  }

  checkDataModifiedOutside(): boolean {
    if (this.dataCur.length !== this.data.length) return true;

    let hasModify = false;

    for (let item of this.data) {
      let hasItemNotInCache = true;

      for (let cur of this.dataCur) {
        if (item === cur) {
          hasItemNotInCache = false;
          break;
        }
      }

      if (hasItemNotInCache) {
        hasModify = true;
        break;
      }
    }

    return hasModify;
  }

  checkDataOverflow() {
    // 如果已经超过数据最大值, 那么卸载底部数据。
    if (this.data && this.data.length > this.maxDataCount) {
      this.autoUnload();
    }
  }

  autoUnload() {
    if (this.el.scrollTop < this.el.scrollHeight / 2) {
      // 滚动条在顶部, 卸载底部数据
      this.unloadFoot();
    } else {
      this.unloadHead();
    }
  }

  loadHead(): number {
    let loadCount = 0;

    if (!this.dataCache || !this.dataCache.length) return loadCount;

    if (!this.data.length) {
      this.setCacheToData();
      return loadCount;
    }

    let firstData = this.data[0];
    let firstDataInCacheIndex = _.indexOf(this.dataCache, firstData);

    if (firstDataInCacheIndex !== -1) {
      let _data = [];
      for (let i = firstDataInCacheIndex - 1; i >= firstDataInCacheIndex - this.loadCount; i--) {
        if (i < 0) break;

        _data.unshift(this.dataCache[i]);
        loadCount++;
      }


      if (loadCount !== 0) {
        setTimeout(() => {
          this.data.splice(0, 0, ..._data);
          this.isHeadLoadingShown = false;
          this.checkDataOverflow();
          this.resetScrollTop(true);
          this.calculateHash();
        }, 500);

        // this.checkTouch();
      }
    }

    return loadCount;
  }

  unloadHead() {
    let unloadCount = this.data.length - this.maxDataCount;

    if (unloadCount <= 0) return;

    this.data.splice(0, unloadCount);
    this.calculateHash();
    // this.checkTouch();
  }

  loadFoot(): number {
    let loadCount = 0;

    if (!this.dataCache || !this.dataCache.length) return loadCount;

    if (!this.data.length) {
      this.setCacheToData();
      return loadCount;
    }

    let lastData = this.data[this.data.length - 1];
    let lastDataInCacheIndex = _.indexOf(this.dataCache, lastData);

    if (lastDataInCacheIndex !== -1) {
      let _data = [];
      for (let i = lastDataInCacheIndex + 1; i <= lastDataInCacheIndex + this.loadCount; i++) {
        if (i > this.dataCache.length - 1) break;

        _data.push(this.dataCache[i]);
        loadCount++;
      }

      if (loadCount !== 0) {
        // 为了保持loading的显示, 不要消失太快, 避免闪烁。
        setTimeout(() => {
          this.data.splice(this.data.length, 0, ..._data);
          this.isFootLoadingShown = false;
          this.checkDataOverflow();
          this.resetScrollTop(false);
          this.calculateHash();
        }, 500);

        // this.checkTouch();
      }
    }

    return loadCount;
  }

  unloadFoot() {
    let unloadCount = this.data.length - this.maxDataCount;

    if (unloadCount <= 0) return;

    this.data.splice(this.data.length - unloadCount, unloadCount);
    this.calculateHash();
    // this.checkTouch();
  }

  prependData(data: any[]) {
    this.isHeadLoadingShown = false;
    console.log('hide head on prepend');

    if (data.length === 0) return;

    this.data.splice(0, 0, ...data);
    this.dataCache.splice(0, 0, ...data);
    this.checkDataOverflow();
    this.resetScrollTop(true);
    this.calculateHash();
    // this.checkTouch();
  }

  appendData(data: any[]) {
    this.isFootLoadingShown = false;

    if (data.length === 0) return;

    this.data.splice(this.data.length, 0, ...data);
    this.dataCache.splice(this.dataCache.length, 0, ...data);
    this.checkDataOverflow();
    this.resetScrollTop(false);
    this.calculateHash();
    // this.checkTouch();
  }

  insertData(start: number, data: any[]) {
    if (data.length === 0) return;

    let startIndexInCache = _.indexOf(this.dataCache, (<any>_).nth(this.data, start));
    if (!startIndexInCache) return;

    this.data.splice(start, 0, ...data);
    this.dataCache.splice(startIndexInCache, 0, ...data);
    this.checkDataOverflow();
    this.calculateHash();
    // this.checkTouch();
  }

  deleteData(start: number, length: number) {
    let startIndexInCache = _.indexOf(this.dataCache, (<any>_).nth(this.data, start));
    if (!startIndexInCache) return;

    this.data.splice(start, length);
    this.dataCache.splice(startIndexInCache, length);
    this.checkDataOverflow();
    this.calculateHash();
    // this.checkTouch();
  }

  replaceData(start: number, length: number, data: any[]) {
    if (data.length === 0) return;

    let startIndexInCache = _.indexOf(this.dataCache, (<any>_).nth(this.data, start));
    if (!startIndexInCache) return;

    this.data.splice(start, length, ...data);
    this.dataCache.splice(startIndexInCache, length, ...data);

    this.calculateHash();
    // this.checkTouch();
    this.checkDataOverflow();
  }

  resetData(data: any[]) {
    if (data.length === 0) return;

    this.data.splice(0, this.data.length, ...data);
    this.setDataToCache();

    this.calculateHash();
    // this.checkTouch();
    this.checkDataOverflow();
  }

  setDataToCache() {
    this.dataCache = clone(this.data);
  }

  setCacheToData() {
    this.data = clone(this.dataCache);
    this.calculateHash();
    // this.checkTouch();
    this.checkDataOverflow();
  }

  scrollToTop() {
    this.el.scrollTop = 0;
  }

  scrollToBottom() {
    this.el.scrollTop = this.el.scrollHeight - this.$el.height();
  }

  startEmitScrollEvent() {
    this.emiting = true;
  }

  stopEmitScrollEvent() {
    this.emiting = false;
  }

  emitScrollEvent() {
    let scrollEvent = new ScrollerEventModel();
    // 记录scrollTop;
    scrollEvent.scrollTop = this.el.scrollTop;

    // 记录滚动条的位置状态
    let scrollBottom = this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight;
    let position: ScrollerPosition;

    if (this.el.scrollTop >= 0 && this.el.scrollTop <= 10) {
      position = ScrollerPosition.OnTop;
    } else if (scrollBottom >= 0 && scrollBottom <= 10) {
      position = ScrollerPosition.OnBottom;
    } else {
      position = ScrollerPosition.OnMiddle;
    }

    scrollEvent.position = position;

    if (scrollEvent.position === ScrollerPosition.OnTop) {
      if (!this.enterHead && !this.isHeadLoadingShown) {
        this.enterHead = true;
        this.isHeadLoadingShown = true;

        let loadCount = this.loadHead();

        // 如果加载不到顶部的更多缓存数据, 那么通知外部到顶。
        if (loadCount === 0) this.scroller.emit(scrollEvent);

        // this.startObserveTouch();
      }
    } else if (scrollEvent.position === ScrollerPosition.OnBottom) {
      if (!this.enterFoot && !this.isFootLoadingShown) {
        this.enterFoot = true;
        this.isFootLoadingShown = true;

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);

        let loadCount = this.loadFoot();

        // 如果加载不到顶部的更多缓存数据, 那么通知外部到底。
        if (loadCount === 0) this.scroller.emit(scrollEvent);
        // this.startObserveTouch();
      }
    } else {
      this.enterHead = false;
      this.enterFoot = false;
      this.scroller.emit(scrollEvent);
      // this.stopObserveTouch();
    }
  }

  calculateHash() {
    this.dataCur = clone(this.data);
  }

  resetScrollTop(isPrepend: boolean) {
    let $container = this.$dataContainer && this.$dataContainer.length ? this.$dataContainer : this.$el;

    let $child = isPrepend ? $container.children().first() : $container.children().last();

    if ($child.length) {
      if (isPrepend) {
        setTimeout(() => {
          this.$el.scrollTop($child.position().top);
        }, 0);
      } else {
        setTimeout(() => {
          this.$el.scrollTop($child.position().top + this.containerOffset - this.$el.outerHeight() + $child.outerHeight(true));
        }, 0);
      }
    }
  }

  hideHeadLoading() {
    this.isHeadLoadingShown = false;
    console.log('hide head on func');
  }

  hideFootLoading() {
    this.isFootLoadingShown = false;
  }

  // checkTouch() {
  //   let scrollBottom = this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight;
  //
  //   setTimeout(() => {
  //     if (this.el.scrollTop >= 0 && this.el.scrollTop <= 0) {
  //       this.startObserveTouch();
  //     } else if (scrollBottom >= 0 && scrollBottom <= 0) {
  //       this.startObserveTouch();
  //     } else {
  //       this.stopObserveTouch();
  //     }
  //   }, 0);
  // }
  //
  // startObserveTouch() {
  //   if (this.touchObserving) return;
  //
  //   this.touchObserving = true;
  //   let touchStart = 0;
  //
  //   this.$el.on('touchstart', (e) => {
  //     touchStart = e.originalEvent.touches[0].clientY;
  //   });
  //
  //   this.$el.on('touchend', (e) => {
  //     let isUp = e.originalEvent.changedTouches[0].clientY > touchStart;
  //
  //     if (this.emiting) {
  //       let scrollBottom = this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight;
  //       let scrollEvent = new ScrollerEventModel();
  //
  //       if (isUp && this.el.scrollTop === 0) {
  //         let loadCount = this.loadHead();
  //
  //         // 如果加载不到顶部的更多缓存数据, 那么通知外部到顶。
  //         if (loadCount === 0) {
  //           scrollEvent.position = ScrollerPosition.OnTop;
  //           scrollEvent.scrollTop = 0;
  //           this.scroller.emit(scrollEvent);
  //         }
  //       }
  //
  //       if (!isUp && scrollBottom === 0) {
  //         let loadCount = this.loadFoot();
  //
  //         // 如果加载不到顶部的更多缓存数据, 那么通知外部到顶。
  //         if (loadCount === 0) {
  //           scrollEvent.position = ScrollerPosition.OnBottom;
  //           scrollEvent.scrollTop = this.el.scrollTop;
  //           this.scroller.emit(scrollEvent);
  //         }
  //       }
  //     }
  //   });
  // }
  //
  // stopObserveTouch() {
  //   this.touchObserving = false;
  //   this.$el.off('touchstart touchend');
  // }

  ngOnInit() {
    this.setDataToCache();
    this.calculateHash();

    this.$el.on('scroll', (e) => {
      if (this.emiting) this.emitScrollEvent();
    });

    this.startEmitScrollEvent();
  }
}
