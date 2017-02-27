import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {environment} from "../../../../environments/environment";
import {MyListModel, MyListResult} from "./my.model";

@Injectable()
export class MyApiService {
  constructor(private http: Http) {
  }

  histories(size: number, marker?: string): Promise<MyListResult> {
    let query: any = {
      size: size,
    };

    if (marker) query.marker = marker;

    const url = `${environment.config.host.io}/api/live/my/history/objects?${$.param(query)}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let list = [];
      let marker = data.include ? data.include.marker : '';
      let hasMore = data.include ? data.include.has_more : false;

      for (let item of data.result) {
        list.push(new MyListModel(item));
      }

      return new MyListResult(list, marker, hasMore);
    });
  }

  favorites(size: number, marker?: string): Promise<MyListResult> {
    let query: any = {
      size: size,
    };

    if (marker) query.marker = marker;

    const url = `${environment.config.host.io}/api/live/my/favorited/objects?${$.param(query)}`;
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let list = [];
      let marker = data.include ? data.include.marker : '';
      let hasMore = data.include ? data.include.has_more : false;

      for (let item of data.result) {
        list.push(new MyListModel(item));
      }

      return new MyListResult(list, marker, hasMore);
    });
  }
}
