import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ListViewModel, ListViewResult} from "../../shared/list-view/list-view.model";
import {SearchApiService} from "../../shared/api/search/search.api";
import {SearchResultItem} from "../../shared/api/search/search.model";
import {Subscription} from "rxjs";

@Component({
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})

export class SearchResultComponent implements OnInit, OnDestroy {
  loader: (size: number, marker?: string) => Promise<ListViewResult>;
  keyword: string;
  paramsSub: Subscription[] = [];

  constructor(private searchApiService: SearchApiService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.paramsSub.push(
      this.route.params.subscribe(params => {
        let keyword = params['q'];

        this.resetLoader(keyword);
      })
    );

    this.paramsSub.push(
      this.route.queryParams.subscribe(params => {
        let keyword = params['q'];

        this.resetLoader(keyword);
      })
    );
  }

  ngOnDestroy() {
    for (let sub of this.paramsSub) sub.unsubscribe();
  }

  resetLoader(keyword: string) {
    if (!keyword && this.keyword) return;

    if (!keyword && !this.keyword) {
      this.loader = null;
      return;
    }

    this.keyword = decodeURIComponent(keyword);

    this.loader = (size: number, marker?: string): Promise<ListViewResult> => {
      if (!marker) marker = '0';

      return this.searchApiService.search(this.keyword, size, +marker).then(result => {
        let list: ListViewModel[] = [];
        for (let item of result.result) {
          if (item.isSpeaker()) continue; // TODO: 之后有speaker页面, 再移除此代码

          list.push(new ListViewModel(item.id, item.coverSmallUrl, item.subject, item.desc, () => this.goto(item)));
        }

        return new ListViewResult(list, `${result.paging.from + result.paging.size}`, result.paging.from + result.paging.size < result.paging.total);
      });
    };
  }

  goto(item: SearchResultItem) {
    if (item.isLive()) {
      this.router.navigate([`/lives/${item.id}`]);
    } else if (item.isTalk()) {
      this.router.navigate([`/talks/${item.id}`]);
    } else if (item.isSpeaker()) {
      this.router.navigate([`/speakers/${item.id}`]);
    }
  }
}
