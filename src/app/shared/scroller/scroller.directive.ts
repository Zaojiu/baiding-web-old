import {Directive, ElementRef, Input, Output, EventEmitter, OnInit, DoCheck} from '@angular/core';
import {ScrollerEventModel} from "./scroller.model";
import {ScrollerPosition} from "./scroller.enums";
import * as clone from "lodash/clone";

declare var $: any;

@Directive({
  selector: '[scroller]'
})

export class ScrollerDirective implements OnInit, DoCheck {
  private el: HTMLElement;
  private $el: any;
  emiting: boolean;
  @Output() scroller = new EventEmitter<ScrollerEventModel>();
  @Input() data: any[];
  @Input() loadCount = 20;
  @Input() maxDataCount = 40;
  private dataCache: any[];

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    this.$el = $(this.el);
  }

  ngDoCheck() {
    if ((!this.dataCache || !this.dataCache.length) && this.data && this.data.length) {
      this.setDataToCache();
    }

    if (this.dataCache && this.dataCache.length) {
      this.syncDataCache();
    }

    // 如果已经超过数据最大值, 那么卸载底部数据。
    if (this.data && this.data.length > this.maxDataCount) {
      this.autoUnload();
    }
  }

  syncDataCache() {
    // 此函数只解决了前后新增缓存没有的数据的情况, 但未解决数据不一致的情况(例如从中间插入, 或者从中间删除)
    // 如果缓存和数据重叠部分不一致, 数据有增删, 那么会有问题, 到时需要重构。

    let firstCacheItem = this.dataCache[0];
    let lastCacheItem = this.dataCache[this.dataCache.length - 1];

    let firstIndexInData = -1;
    let lastIndexInData = -1;
    let itemNeedPrepend = [];
    let itemNeedAppend = [];

    for (let index in this.data) {
      let item = this.data[index];
      if (item === firstCacheItem) firstIndexInData = +index;
      if (item === lastCacheItem) {
        lastIndexInData = +index;
        break;
      }
    }

    if (firstIndexInData !== -1) {
      itemNeedPrepend = this.data.slice(0, firstIndexInData);
    }

    if (lastIndexInData !== -1) {
      itemNeedAppend = this.data.slice(lastIndexInData+1, this.data.length);
    }

    this.dataCache = itemNeedPrepend.concat(this.dataCache);
    this.dataCache = this.dataCache.concat(itemNeedAppend);
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
    let firstDataInCacheIndex = -1;

    for (let index in this.dataCache) {
      let item = this.dataCache[index];
      if (firstData === item) {
        firstDataInCacheIndex = +index;
        break;
      }
    }

    if (firstDataInCacheIndex !== -1) {
      for (let i = firstDataInCacheIndex - 1; i >= firstDataInCacheIndex - this.loadCount; i--) {
        if (i < 0) break;

        this.data.unshift(this.dataCache[i]);

        loadCount++;
      }
    }

    return loadCount;
  }

  unloadHead() {
    var unloadCount = this.data.length - this.maxDataCount;

    for (let i = 0; i <= unloadCount - 1; i++) {
      this.data.shift();
    }
  }

  loadFoot(): number {
    let loadCount = 0;

    if (!this.dataCache || !this.dataCache.length) return loadCount;

    if (!this.data.length) {
      this.setCacheToData();
      return loadCount;
    }

    let lastData = this.data[this.data.length-1];
    let lastDataInCacheIndex = -1;

    for (let index in this.dataCache) {
      let item = this.dataCache[index];
      if (lastData === item) {
        lastDataInCacheIndex = +index;
        break;
      }
    }

    if (lastDataInCacheIndex !== -1) {
      for (let i = lastDataInCacheIndex + 1; i <= lastDataInCacheIndex + this.loadCount; i++) {
        if (i > this.dataCache.length - 1) break;

        this.data.push(this.dataCache[i]);

        loadCount++;
      }
    }

    return loadCount;
  }

  unloadFoot() {
    let unloadCount = this.data.length - this.maxDataCount;
    let dataLength = this.data.length;

    for (let i = dataLength - 1; i >= dataLength - unloadCount; i--) {
      this.data.pop();
    }
  }

  setDataToCache() {
    this.dataCache = clone(this.data);
  }

  setCacheToData() {
    this.data = clone(this.dataCache);
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
      let loadCount = this.loadHead();

      // 如果加载不到顶部的更多缓存数据, 那么通知外部到顶。
      if (loadCount === 0) {
        this.scroller.emit(scrollEvent);
      }
    } else if (scrollEvent.position === ScrollerPosition.OnBottom) {
      let loadCount = this.loadFoot();

      // 如果加载不到顶部的更多缓存数据, 那么通知外部到底。
      if (loadCount === 0) {
        this.scroller.emit(scrollEvent);
      }
    } else {
      this.scroller.emit(scrollEvent);
    }
  }

  ngOnInit() {
    this.$el.on('scroll', (e) => {
      if (!this.emiting) return;

      this.emitScrollEvent();
    });

    this.startEmitScrollEvent();
  }
}
