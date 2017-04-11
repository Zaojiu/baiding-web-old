import {Component, OnInit, OnDestroy} from '@angular/core';
import {MyApiService} from "../shared/api/my/my.api";
import {ActivatedRoute, UrlSegment, Router} from "@angular/router";
import {MyListModel} from "../shared/api/my/my.model";
import {ListViewModel, ListViewResult} from "../shared/list-view/list-view.model";
import {Subscription} from "rxjs";

@Component({
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss'],
})

export class MyComponent implements OnInit, OnDestroy {
  loader: (size: number, marker?: string) => Promise<ListViewResult>;
  urlSub: Subscription;

  constructor(private myService: MyApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.urlSub = this.route.url.subscribe(url => this.resetLoader(url));
  }

  ngOnDestroy() {
    if (this.urlSub) this.urlSub.unsubscribe();
  }

  resetLoader(url: UrlSegment[]) {
    let loader = null;

    if (url[0].path === 'favorites') {
      loader = (size: number, marker?: string) => {return this.myService.favorites(size, marker)};
    } else if (url[0].path === 'histories') {
      loader = (size: number, marker?: string) => {return this.myService.histories(size, marker)};
    }

    if (loader) {
      this.loader = (size: number, marker?: string): Promise<ListViewResult> => {
        return loader(size, marker).then(result => {
          let list: ListViewModel[] = [];
          for (let item of result.result) {
            if (item.isSpeaker()) continue; // TODO: 之后有speaker页面, 再移除此代码

            list.push(new ListViewModel(item.id, item.coverSmall11Url, item.subject, item.desc, () => this.goto(item)));
          }
          return new ListViewResult(list, result.marker, result.hasMore);
        });
      };
    }
  }

  goto(item: MyListModel) {
    if (item.isLive()) {
      this.router.navigate([`/lives/${item.id}`]);
    } else if (item.isTalk()) {
      this.router.navigate([`/talks/${item.id}`]);
    } else if (item.isSpeaker()) {
      this.router.navigate([`/speakers/${item.id}`]);
    }
  }
}
