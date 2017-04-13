import {Component, OnChanges, SimpleChanges, Input, ViewChild, ElementRef} from '@angular/core';
import {ListViewResult, ListViewModel} from "./list-view.model";

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})

export class ListViewComponent implements OnChanges {
  @Input() loader: (size: number, marker?: string) => Promise<ListViewResult>;
  @Input() noDataTips: string;
  @ViewChild('listEle') listEle: ElementRef;
  hasMore: boolean;
  isLoading: boolean;
  listSize = 20;
  listResult: ListViewResult = new ListViewResult([], '', false);

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    let loaderChange = changes['loader'];

    if (loaderChange && loaderChange.currentValue) {
      this.processListData();
    }
  }

  processListData(marker = '') {
    if (!this.loader || this.isLoading) return;

    this.isLoading = true;

    this.loader(this.listSize, marker).then((result) => {
      this.listResult.hasMore = result.hasMore;
      this.listResult.marker = result.marker;
      this.listResult.result.push(...result.result);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  getNextResult() {
    if (!this.listResult.result.length) return;

    this.processListData(this.listResult.marker);
  }

  onScroll() {
    if (!this.listResult.hasMore || !this.listEle) return;

    let el = this.listEle.nativeElement;
    let scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    let isOnBottom = scrollBottom >= 0 && scrollBottom <= 10;

    if (isOnBottom) this.getNextResult();
  }

  resetDefaultCover(item: ListViewModel) {
    item.cover = '/assets/img/default-cover.jpg';
  }
}
