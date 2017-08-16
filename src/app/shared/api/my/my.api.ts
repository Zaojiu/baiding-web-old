import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {environment} from "../../../../environments/environment";
import {MyListModel, MyListResult, TicketModel} from "./my.model";
import {StoreService} from "../../store/store.service";

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
      data.result = data.result || [];
      let list = [];
      let marker = data.include ? data.include.marker : '';
      let hasMore = data.include ? data.include.has_more : false;

      for (let item of data.result) {
        let model = new MyListModel(item);
        list.push(model);

        // 缓存talk信息
        let objectCache = StoreService.get('objectCache') || {};
        objectCache[item.id] = model;
        StoreService.set('objectCache', objectCache);
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
      data.result = data.result || [];
      let list = [];
      let marker = data.include ? data.include.marker : '';
      let hasMore = data.include ? data.include.has_more : false;

      for (let item of data.result) {
        let model = new MyListModel(item);
        list.push(model);

        // 缓存talk信息
        let objectCache = StoreService.get('objectCache') || {};
        objectCache[item.id] = model;
        StoreService.set('objectCache', objectCache);
      }

      return new MyListResult(list, marker, hasMore);
    });
  }

  tickets(): Promise<TicketModel[]> {
    const url = `${environment.config.host.io}/api/live/my/events/tickets`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      const result = data.result || [];
      const tickets = [];

      for (let item of result) {
        let model = new TicketModel(item);
        tickets.push(model);
      }

      return tickets;
    });
  }
}
