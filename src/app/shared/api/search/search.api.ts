import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {environment} from "../../../../environments/environment";
import {SearchResult, SearchResultItem, SearchPaging} from "./search.model";

@Injectable()
export class SearchApiService {
  constructor(private http: Http) {
  }

  search(key: string, size: number, from: number): Promise<SearchResult> {
    const url = `${environment.config.host.io}/api/live/objects/search`;
    let query = {
      q: key,
      size: size,
      from: from,
    };

    return this.http.get(`${url}?${$.param(query)}`).toPromise().then(res => {
      let data = res.json();
      let result = data.result;
      let pagingData = data.paging;
      let items: SearchResultItem[] = [];
      let paging = new SearchPaging(pagingData.from, pagingData.size, pagingData.total);

      if (!result || !result.length) return new SearchResult([], paging);

      for (let item of result) {
        items.push(new SearchResultItem(item));
      }

      return new SearchResult(items, paging);
    });
  }
}
