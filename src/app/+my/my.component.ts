import {Component, OnInit, OnDestroy} from '@angular/core';
import {MyApiService} from "../shared/api/my/my.api";
import {ActivatedRoute, UrlSegment, Router} from "@angular/router";
import {MyListModel} from "../shared/api/my/my.model";
import {ListViewModel, ListViewResult} from "../shared/list-view/list-view.model";
import {UtilsService} from '../shared/utils/utils';
import {IosBridgeService} from '../shared/ios-bridge/ios-bridge.service';
import {Subscription} from "rxjs";

@Component({
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss'],
})

export class MyComponent implements OnInit, OnDestroy {
  loader: (size: number, marker?: string) => Promise<ListViewResult>;
  urlSub: Subscription;
  isInApp = UtilsService.isInApp;
  constructor(private myService: MyApiService,
              private route: ActivatedRoute,
              private router: Router,
              private iosBridge: IosBridgeService) {
  }

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
            list.push(new ListViewModel(item.id, item.coverSmallUrl, item.subject, item.desc, () => this.goto(item)));
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
    } else if (item.isTopicPost()) {
      if (this.isInApp) {
        this.iosBridge.gotoTopicPost(item.id);
      } else {
        this.router.navigate([`/topic-post/${item.id}`]);
      }
    } else if (item.isSpeaker()) {
      if (this.isInApp) {
        this.iosBridge.gotoSpeaker(item.id);
      } else {
        return;
      }
    }
  }
}
