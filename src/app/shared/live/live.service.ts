import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { LiveInfoModel } from './live.model';
import { AppConfig } from '../../app.config';
import { StoreService } from '../store/store.service';

@Injectable()
export class LiveService {
  private mockUrl: string = '../../../assets/mock-data/live-room-info.json';
  constructor (private http: Http, private config: AppConfig, private store: StoreService) {}

  getLiveInfo(id: string, needRefresh?: boolean): Promise<LiveInfoModel> {
    let lives = this.store.get('lives') || {};
    let liveInfoCache = lives[id];
    if (liveInfoCache && !needRefresh) return Promise.resolve(liveInfoCache);

    const url = `${this.config.urlPrefix.io}/api/streams/${id}`;
    return this.http.get(url).toPromise().then(res => {
      let liveInfo = res.json() as LiveInfoModel;
      lives[liveInfo.id] = liveInfo;

      this.store.set('lives', lives);

      return liveInfo;
    });
      // .catch(this.handleError);
  }
}
