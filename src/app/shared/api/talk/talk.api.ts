import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {StoreService} from '../../store/store.service';
import {environment} from "../../../../environments/environment";
import {TalkInfoModel} from "./talk.model";

@Injectable()
export class TalkService {
  constructor(private http: Http) {
  }

  getTalkInfo(id: string, needRefresh = false): Promise<TalkInfoModel> {
    let talks = StoreService.get('talks') || {};
    let talksInfoCache = talks[id];
    if (talksInfoCache && !needRefresh) return Promise.resolve(talksInfoCache);

    // const url = `${environment.config.host.io}/api/live/streams/${id}}`;
    const url = '/assets/mock-data/talk.json';
    return this.http.get(url).toPromise().then(res => {
      let data = res.json();
      let talkInfo = new TalkInfoModel(data.talk, data.users);

      return talkInfo;
    });
  }
}
